# gestao_kungfu/serializers.py

from rest_framework import serializers
# Importa modelos da sua aplicação
from .models import (
    Escola, Diretoria, Faixa, Aluno, Instrutor, Programa, 
    Equipamento, CalendarioAula, Aula, Graduacao
)
# Importa modelos do Django para User e Group
from django.contrib.auth.models import User, Group

# ----------------------------------------------------------------------
# Serializers de Cadastros Base e Aplicação (Modelos Próprios)
# ----------------------------------------------------------------------

class EscolaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Escola
        fields = '__all__'

class FaixaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faixa
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    # Campo calculado para trazer o nome da faixa no JSON de consulta
    nome_faixa = serializers.CharField(source='faixa_atual.cor', read_only=True)
    
    class Meta:
        model = Aluno
        fields = '__all__'
        
class InstrutorSerializer(serializers.ModelSerializer):
    # O instrutor é um Aluno, então puxamos o nome do aluno
    nome_instrutor = serializers.CharField(source='aluno.nome', read_only=True)
    
    class Meta:
        model = Instrutor
        fields = '__all__'

class DiretoriaSerializer(serializers.ModelSerializer):
    # Serializer para o modelo de diretoria
    class Meta:
        model = Diretoria
        fields = '__all__'

class ProgramaSerializer(serializers.ModelSerializer):
    # Serializer para o modelo de programa
    class Meta:
        model = Programa
        fields = '__all__'

class EquipamentoSerializer(serializers.ModelSerializer):
    # Serializer para o modelo de equipamento
    class Meta:
        model = Equipamento
        fields = '__all__'

# ----------------------------------------------------------------------
# Serializers de Processos
# ----------------------------------------------------------------------

class CalendarioAulaSerializer(serializers.ModelSerializer):
    nome_faixa = serializers.CharField(source='faixa_alvo.cor', read_only=True)
    
    class Meta:
        model = CalendarioAula
        fields = '__all__'

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        fields = '__all__'

class GraduacaoSerializer(serializers.ModelSerializer):
    nome_aluno = serializers.CharField(source='aluno.nome', read_only=True)
    nome_faixa_nova = serializers.CharField(source='faixa_nova.cor', read_only=True)
    
    class Meta:
        model = Graduacao
        fields = '__all__'

# ----------------------------------------------------------------------
# Serializer para Gerenciamento de Usuários (Autenticação e Permissões)
# ----------------------------------------------------------------------

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Campo para receber a role (ex: 'Alunos', 'Diretoria'). write_only=True: não retorna no GET.
    role = serializers.CharField(write_only=True) 
    
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'role')

    def create(self, validated_data):
        # 1. Puxa a role para usá-la depois de criar o usuário
        role_name = validated_data.pop('role', None) 
        
        # 2. Cria o usuário do Django (hashed password)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        
        # 3. Atribui o usuário ao Grupo (Role)
        if role_name:
            try:
                # Busca o grupo pelo nome (ignora caixa baixa/alta)
                group = Group.objects.get(name__iexact=role_name) 
                user.groups.add(group)
            except Group.DoesNotExist:
                # Se o grupo não existir no Admin, o usuário é criado sem grupo
                pass
                
        return user

# NO FINAL de gestao_kungfu/serializers.py

from django.contrib.auth import authenticate 
from django.utils.translation import gettext_lazy as _
# Importe User e Group novamente (embora já estejam no topo, garanta a acessibilidade)
from django.contrib.auth.models import User, Group 


# ----------------------------------------------------------------------
# NOVO Serializer para Login (Usado por CustomAuthToken)
# ----------------------------------------------------------------------
class AuthTokenSerializer(serializers.Serializer):
    """
    Serializer customizado para validar credenciais de login usando django.contrib.auth.authenticate.
    """
    username = serializers.CharField()
    # Style: Ajuda a renderizar o campo como senha no Browsable API
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Chama a função de autenticação nativa do Django
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            
            # Se a autenticação falhar
            if not user:
                msg = _('Usuário ou senha inválidos.')
                raise serializers.ValidationError(msg, code='authorization')
            
            # Se o usuário estiver inativo (is_active=False)
            if not user.is_active:
                msg = _('Conta de usuário está inativa.')
                raise serializers.ValidationError(msg, code='authorization')

        else:
            msg = _('Deve incluir "username" e "password".')
            raise serializers.ValidationError(msg, code='authorization')

        # Adiciona o objeto 'user' validado ao dicionário de atributos
        attrs['user'] = user
        return attrs