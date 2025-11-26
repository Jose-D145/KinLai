# D:\ITKFA\gestao_kungfu\urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import UserRegistrationView # Import da View de Registro

# 1. Configuração do Router (Para ViewSets de CRUD)
router = DefaultRouter()
router.register(r'escolas', views.EscolaViewSet)
router.register(r'faixas', views.FaixaViewSet)
router.register(r'alunos', views.AlunoViewSet)
router.register(r'instrutores', views.InstrutorViewSet)
router.register(r'diretoria', views.DiretoriaViewSet)
router.register(r'programa', views.ProgramaViewSet)
router.register(r'equipamento', views.EquipamentoViewSet)
router.register(r'calendario', views.CalendarioAulaViewSet)
router.register(r'aulas', views.AulaViewSet)
router.register(r'graduacoes', views.GraduacaoViewSet)

# 2. DEFINIÇÃO DA LISTA DE ROTAS

# Inicializa a lista com as rotas manuais (APIView)
urlpatterns = [
    # ROTA MANUAL 1: REGISTRO DE USUÁRIO (APIView)
    path('register/', UserRegistrationView.as_view(), name='user_register'), 
    
    # ROTA MANUAL 2 (Exemplo de rota raiz customizada da API - remova se não for usar)
    # path('', views.api_root), 
] 

# 3. CONCATENAÇÃO: Adiciona todas as rotas geradas pelo Router (ViewSets) ao final
# Isso adiciona /alunos/, /faixas/, etc.
urlpatterns += router.urls

# A sua estrutura está correta! A concatenação com "+= router.urls" é a forma ideal.