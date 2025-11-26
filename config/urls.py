# D:\ITKFA\config\urls.py

from django.contrib import admin
from django.urls import path, include 
from rest_framework.authtoken.views import ObtainAuthToken 
# Importa a sua View Customizada (que está no gestao_kungfu/api.py)
from gestao_kungfu.api import CustomAuthToken 

urlpatterns = [
    # 1. ROTA DE LOGIN DE TOKEN (Usa a sua View Customizada)
    # ESSA LINHA FORÇA O USO DA LÓGICA QUE RETORNA O CAMPO 'roles'
    path('auth/token/login/', CustomAuthToken.as_view(), name='api_token_auth'), 
    
    # 2. CONEXÃO DA API
    path('api/', include('gestao_kungfu.urls')), 
    
    # 3. Painel de Administração
    path('admin/', admin.site.urls),
]