// src/services/api.ts

import axios from 'axios';

// ----------------------------------------
// 1. Definição dos Tipos de Resposta da API
// ----------------------------------------
interface LoginResponse {
    token: string;
    user_id: number;
    username: string;
    email?: string;
    roles: string[]; // Lista de roles (e.g., 'Aluno', 'Diretoria')
}

const API_BASE_URL = 'http://localhost:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  // Necessário para garantir que o navegador envie o token e as permissões de CORS
  withCredentials: true, 
});

// ----------------------------------------
// 2. Função de Login
// ----------------------------------------
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    // A requisição agora está tipada para esperar a resposta completa do CustomAuthToken
    const response = await api.post<LoginResponse>('auth/token/login/', {
      username,
      password,
    });

    const token = response.data.token;

    // 1. Armazena no cabeçalho padrão (essencial para todas as requisições CRUD)
    api.defaults.headers.common['Authorization'] = `Token ${token}`;

    // 2. Salva no localStorage para persistência entre sessões
    localStorage.setItem('auth_token', token);
    
    // **Retorna o objeto completo** para que o AuthContext possa salvar as 'roles'
    return response.data;

  } catch (error) {
    // Lida com erros (400, 401, etc.)
    throw error;
  }
};

// ----------------------------------------
// 3. Função de Logout
// ----------------------------------------
export const logout = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('auth_token');
};

// ----------------------------------------
// 4. Lógica de Inicialização (Restaura o Token)
// ----------------------------------------
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export default api;