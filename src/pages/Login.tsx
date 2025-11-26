// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Hook do AuthContext
import { toast } from 'react-toastify';
import { ASSOCIATION_DATA } from '../constants';

const Login: React.FC = () => {
  // 1. Captura o parâmetro de URL definido na rota App.tsx (/:schoolId/login)
  const { schoolId } = useParams<{ schoolId: string }>(); 
  
  // 2. Importa a função de login e o estado do AuthContext
  const { login: contextLogin } = useAuth(); 
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Verifica se o schoolId foi capturado (evita o erro silencioso)
    if (typeof schoolId !== 'string' || !schoolId) {
      toast.error("Erro: ID da escola não encontrado na URL. Selecione a escola novamente.");
      navigate('/', { replace: true });
      return; 
    }

    try {
      // 4. Chama a função do AuthContext, passando o schoolId para salvar no estado global
      await contextLogin(username, password, schoolId); 
      
      // O redirecionamento e o toast de sucesso são tratados DENTRO do contextLogin,
      // mas se o contextLogin falhar em redirecionar, este toast garante feedback.
      // toast.success('Login realizado com sucesso! Redirecionando para o Portal.'); 

    } catch (error) {
      toast.error('Credenciais inválidas ou erro no servidor.');
    }
  };

  // ... (Restante do código de renderização do formulário) ...
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-yellow-500/50">
        <div className="flex flex-col items-center mb-6">
          <img src={ASSOCIATION_DATA.logoUrl} alt="Logo" className="h-16 w-16 mb-3" />
          <h2 className="text-2xl font-bold text-yellow-400">Acesso à Escola ID: {schoolId}</h2>
          <p className="text-gray-400">Entre com suas credenciais.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Usuário:</label>
            <input 
              type="text" 
              className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-yellow-500 focus:border-yellow-500"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Senha:</label>
            <input 
              type="password" 
              className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-yellow-500 focus:border-yellow-500"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md transition duration-150"
          >
            Entrar no Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;