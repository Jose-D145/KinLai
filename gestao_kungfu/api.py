# D:\ITKFA\gestao_kungfu\api.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView # Nova classe base
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group, User 

# Importa o serializer de autenticação que acabamos de criar (deve estar em serializers.py)
from .serializers import AuthTokenSerializer 

class CustomAuthToken(APIView): 
    """
    Endpoint customizado para Login. Não herda do ObtainAuthToken para evitar conflito de cache.
    Usa AuthTokenSerializer para validar credenciais.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # 1. Valida as credenciais (username/password)
        # O serializer usa django.contrib.auth.authenticate()
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # O objeto 'user' validado é anexado ao serializer.validated_data
        user = serializer.validated_data['user']

        # 2. Obtém/Cria o Token
        # O token é necessário para o React manter a sessão
        token, created = Token.objects.get_or_create(user=user)

        # 3. EXTRAÇÃO DEFINITIVA DAS ROLES (FORÇA A CONSULTA DE GRUPOS)
        # user.groups.all() garante que buscamos as associações de grupo mais atuais
        roles = [group.name for group in user.groups.all()]
        
        # 4. Retorna a resposta completa
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'roles': roles, # <--- ESTA LISTA DEVE CONTER 'Diretoria'
        }, status=status.HTTP_200_OK)