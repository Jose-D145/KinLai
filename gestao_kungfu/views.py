# gestao_kungfu/views.py

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny # AllowAny é novo
from rest_framework.views import APIView # Novo para registro
from rest_framework.response import Response # Novo para registro
from rest_framework.decorators import action # Novo import
# from django.db.models import OuterRef # Novo import para subquery - não é necessário mais

from .models import (
    Escola, Diretoria, Faixa, Aluno, Instrutor, Programa, 
    Equipamento, CalendarioAula, Aula, Graduacao
)
from .serializers import (
    EscolaSerializer, FaixaSerializer, AlunoSerializer, InstrutorSerializer, DiretoriaSerializer,
    ProgramaSerializer, EquipamentoSerializer, CalendarioAulaSerializer, AulaSerializer, GraduacaoSerializer,
    UserRegistrationSerializer # NOVO IMPORT do serializer de registro
)

# ----------------------------------------------------------------------
# 1. ViewSets de Gestão de Dados (CRUD)
# ----------------------------------------------------------------------

# Estes ViewSets são protegidos globalmente pelas configurações de REST_FRAMEWORK
# (Requerem Token ou Sessão)

class EscolaViewSet(viewsets.ModelViewSet):
    queryset = Escola.objects.all()
    serializer_class = EscolaSerializer

class FaixaViewSet(viewsets.ModelViewSet):
    queryset = Faixa.objects.all()
    serializer_class = FaixaSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    # Queryset padrão (para listagem geral do CRUD)
    queryset = Aluno.objects.all() 
    serializer_class = AlunoSerializer

    # ----------------------------------------------------------------------
    # NOVO ENDPOINT CUSTOMIZADO: Lista Alunos Elegíveis para Promoção
    # URL: /api/alunos/elegiveis/
    # ----------------------------------------------------------------------
    @action(detail=False, methods=['get'])
    def elegiveis(self, request):
        
        # 1. Filtro 1: Apenas alunos ativos (Soft Delete)
        ativos = self.queryset.filter(data_desativacao__isnull=True)
        
        # 2. Filtro 2: Alunos que NÂO são instrutores (Excluindo PKs que existem na tabela Instrutor)
        # O modelo Instrutor tem uma PK que é o ID do Aluno.
        nao_instrutores = ativos.exclude(pk__in=Instrutor.objects.all().values_list('aluno', flat=True))

        # 3. Filtro 3: Alunos que estão em uma Faixa elegível para promoção
        alunos_elegiveis = nao_instrutores.filter(
            faixa_atual__elegivel_instrutor=True
        )
        
        serializer = self.get_serializer(alunos_elegiveis, many=True)
        return Response(serializer.data)

class InstrutorViewSet(viewsets.ModelViewSet):
    queryset = Instrutor.objects.all()
    serializer_class = InstrutorSerializer

class DiretoriaViewSet(viewsets.ModelViewSet):
    queryset = Diretoria.objects.all()
    serializer_class = DiretoriaSerializer

class ProgramaViewSet(viewsets.ModelViewSet):
    queryset = Programa.objects.all()
    serializer_class = ProgramaSerializer

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer

class CalendarioAulaViewSet(viewsets.ModelViewSet):
    queryset = CalendarioAula.objects.all()
    serializer_class = CalendarioAulaSerializer

class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer

class GraduacaoViewSet(viewsets.ModelViewSet):
    queryset = Graduacao.objects.all()
    serializer_class = GraduacaoSerializer

# ----------------------------------------------------------------------
# 2. View de Serviço (Registro de Usuário com Atribuição de Role)
# ----------------------------------------------------------------------

class UserRegistrationView(APIView):
    # Permite acesso SEM autenticação, pois o objetivo é criar uma conta.
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            # A lógica de criação do usuário e atribuição do Grupo ('Alunos', etc.)
            # está em UserRegistrationSerializer.create()
            user = serializer.save() 
            
            return Response(
                {"message": f"Usuário {user.username} criado com sucesso e atribuído ao grupo."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)