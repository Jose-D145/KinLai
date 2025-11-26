// src/components/WhiteLabelPage.tsx

import React, { useMemo } from 'react';
import { useNavigate, useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../services/api';
// IMPORT PENDENTE: Crie este arquivo para obter o usuário logado
import { useAuth, UserRole } from '../contexts/AuthContext';
import type { School } from '../types';
import { ASSOCIATION_DATA } from '../constants';

interface WhiteLabelPageProps {
  school: School;
  // onBack foi removido e substituído por logout/navigate
}

// Mapeamento Central das Funcionalidades por Role (RBAC)
const ALL_FUNCTIONS = [
    // Funcionalidades Comuns / Dashboard
    { id: 'dashboard', name: 'Dashboard Principal', roles: ['Aluno', 'Instrutor', 'Diretoria'] },
    
    // Funcionalidades de Aluno
    { id: 'historico-aulas', name: '1. Histórico de Aulas', roles: ['Aluno'] },
    { id: 'programacao-aulas', name: '2. Programar Aulas (Mês)', roles: ['Aluno'] },
    
    // Funcionalidades de Instrutor
    { id: 'gestao-diaria', name: '3. Gestão Diária de Aulas', roles: ['Instrutor', 'Diretoria'] },
    { id: 'confirmacao-aulas', name: '4. Confirmar Aulas (Pós-Aula)', roles: ['Instrutor', 'Diretoria'] },
    { id: 'ficha-aluno', name: '5. Ficha de Evolução (Consulta)', roles: ['Instrutor', 'Diretoria'] },
    
    // Funcionalidades de Diretoria
    { id: 'cadastros', name: '6. Cadastros (CRUD)', roles: ['Diretoria'] },
    { id: 'financeiro', name: '7. Gestão Financeira', roles: ['Diretoria'] },
    { id: 'config-escola', name: '8. Configurações da Escola', roles: ['Diretoria'] },
    { id: 'relatorios', name: '9. Relatórios Gerenciais', roles: ['Diretoria'] },
    { id: 'permissoes', name: '10. Controle de Permissões', roles: ['Diretoria'] },
];

const WhiteLabelPage: React.FC<WhiteLabelPageProps> = ({ school }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { schoolId } = useParams<{ schoolId: string }>();
  const { user, logout } = useAuth(); // <-- Hook para acessar o estado de autenticação
  
  // Extrai as roles do usuário logado (ex: ['Aluno', 'Instrutor'])
  const userRoles = user?.roles || []; 

  // Filtra as funcionalidades visíveis com base nas roles do usuário
 const visibleFunctions = useMemo(() => {
    if (userRoles.length === 0) return [];
    
    // Corrigido: Usamos uma type assertion (as UserRole) para garantir a compatibilidade
    return ALL_FUNCTIONS.filter(func => 
        // Verifica se o usuário possui PELO MENOS uma das roles necessárias para a função
        func.roles.some(role => userRoles.includes(role as UserRole)) // <-- CORREÇÃO AQUI
    );
}, [userRoles]);
  
  const handleLogoff = () => {
    logout(); // Chama a função que limpa o token
    navigate('/', { replace: true }); // Redireciona para a tela de seleção inicial
  };

  return (
    <div className="flex flex-col w-full flex-1 animate-fade-in px-4 sm:px-8 pt-6">
      {/* Top Header */}
      <header className="w-full mb-8 pb-4 border-b border-gray-700 flex flex-col">
        <div className="flex items-start justify-between w-full">
          {/* Left: School info */}
          <div className="flex items-center gap-4">
            <img 
              src={school.logoUrl} 
              alt={`Logo de ${school.name}`}
              className="w-16 h-16 rounded-md border-2 border-gray-600 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">{school.name}</h1>
              <p className="text-sm text-gray-400">Logado como: {userRoles.join(', ')}</p>
            </div>
          </div>
          {/* Right: Association name */}
          <p className="text-base font-semibold text-yellow-400">{ASSOCIATION_DATA.name}</p>
        </div>
        
        <h2 className="w-full text-center text-2xl font-bold text-gray-200 mt-4">
          Controle Administrativo e de Evolução
        </h2>
      </header>
      
      <div className="flex flex-grow gap-8 mb-8">
        {/* Left Menu - DINÂMICO */}
        <nav className="w-56 flex-shrink-0 flex flex-col">
          <div className="flex-grow flex flex-col justify-center">
            <div className="flex flex-col gap-2">
              {visibleFunctions.map((func) => (
                <Link
                  key={func.id}
                  to={`/portal/${schoolId}/${func.id}`} // Rota aninhada
                  className={`w-full p-1 text-center text-sm rounded-2xl transition-colors duration-200 ${
                    location.pathname.includes(func.id) // <--- ATIVO VIA URL
                      ? 'bg-yellow-400 text-black font-semibold shadow-md'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  {func.name}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogoff} // CHAMADA DE LOGOFF
            className="w-full flex items-center justify-center gap-2 p-1 text-center text-sm rounded-2xl transition-colors duration-200 bg-gray-700 hover:bg-red-700 text-yellow-400 font-semibold mt-4"
          >
            {/* ... SVG ... */}
            <span>Sair / Início</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow bg-gray-800 p-6 rounded-lg border border-gray-700">
          <Outlet /> {/* <-- Renderiza o conteúdo da rota aninhada aqui */}
        </main>
      </div>
    </div>
  );
};

export default WhiteLabelPage;