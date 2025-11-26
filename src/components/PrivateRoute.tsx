// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

export const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
    // 1. Puxa o estado de autenticação e o estado de carregamento
    const { isAuthenticated, isLoading } = useAuth(); 

    // Se estiver carregando, exibe um placeholder e espera.
    // Isso impede o redirecionamento prematuro (a condição de corrida).
    if (isLoading) {
        return <div className="p-8 text-yellow-400">Verificando autenticação... Por favor, aguarde.</div>;
    }

    // Se terminou de carregar (isLoading = false) e NÃO está autenticado, redireciona.
    if (!isAuthenticated) {
        // Redireciona para a raiz, que leva à tela de seleção/login
        return <Navigate to="/" replace />; 
    }

    // Se terminou de carregar E está autenticado, renderiza o conteúdo da rota.
    return element;
};