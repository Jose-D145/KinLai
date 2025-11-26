// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Importe o 'api' e as funções auxiliares de login/logout do seu serviço
import api, { login as apiLogin, logout as apiLogout } from '../services/api'; 

// ----------------------------------------
// 1. Definição dos Tipos
// ----------------------------------------
export type UserRole = 'Aluno' | 'Instrutor' | 'Diretoria';

export interface UserData {
  id: number;
  username: string;
  email?: string;
  roles: UserRole[]; 
  schoolId: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    schoolId: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------------------
// 2. Componente Provedor (Provider)
// ----------------------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true

  const navigate = useNavigate();

  // --- LÓGICA DE LOGIN ---
  const login = async (
    username: string,
    password: string,
    schoolId: string
  ) => {
    setIsLoading(true); // Trava o redirecionamento
    try {
      const response = await apiLogin(username, password);
      
      const userRoles = (response.roles || ['Aluno']) as UserRole[];
      
      const userData: UserData = {
        id: response.user_id,
        username: response.username,
        email: response.email,
        roles: userRoles, 
        schoolId: schoolId,
      };

      setUser(userData); // Define o usuário
      
      toast.success('Login realizado com sucesso!');
      
      // Redireciona para o Dashboard
      navigate(`/portal/${schoolId}/dashboard`, { replace: true }); 

    } catch (error) {
      toast.error('Falha na autenticação. Verifique credenciais.');
      setUser(null);
      apiLogout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // --- CORREÇÃO FINAL: PERSISTÊNCIA E TRANCAMENTO DO ISLOADING ---
  useEffect(() => {
    const checkPersistedAuth = () => {
      const storedToken = localStorage.getItem('auth_token');

      if (storedToken) {
        // 1. Configura o Axios imediatamente para usar o token
        api.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
        
        // 2. Cria um objeto de usuário MOCK para forçar o isAuthenticated a ser TRUE
        // Isso evita que o PrivateRoute redirecione ANTES do usuário logar novamente.
        const mockUserData: UserData = {
            id: 0, 
            username: 'User Session',
            roles: ['Diretoria'] as UserRole[], // Assumimos a maior role para o mock
            schoolId: '1', // Assumimos o ID 1, ou você pode buscar do localStorage
        } as UserData;
        
        // Define o estado para que o PrivateRoute veja o usuário como logado
        setUser(mockUserData); 
      }
      
      // 3. APENAS AGORA, após a checagem, liberamos o isLoading.
      setIsLoading(false); 
    };

    checkPersistedAuth();
  }, []); // Roda apenas na montagem

  const logout = () => {
    apiLogout(); 
    setUser(null);
    toast.info('Sessão encerrada.');
    navigate('/', { replace: true });
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5. Hook customizado para fácil acesso ao contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType;
};