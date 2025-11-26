// D:\ITKFA\src\pages\Dashboard.tsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { useParams } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { schoolId } = useParams();

    if (!user) {
        // Esta é uma trava de segurança, embora o PrivateRoute já trate isso.
        return <div className="text-red-500 p-4">Carregando dados do usuário...</div>;
    }

    const { username, roles } = user;
    const isDiretoria = roles.includes('Diretoria');
    const isInstrutor = roles.includes('Instrutor');
    
    // Formata os papéis para exibição
    const roleDisplay = roles.map(role => 
        <span key={role} className="inline-block bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded-full text-sm mr-2">{role}</span>
    );

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-yellow-500 mb-2">
                Bem-vindo(a), {username}!
            </h2>
            <p className="text-gray-400 mb-6">
                ID da Escola: <span className="font-semibold text-white">{schoolId}</span>
            </p>

            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
                <h3 className="text-xl font-bold text-gray-200 mb-4">
                    Visão Geral do Portal
                </h3>
                
                <div className="mb-6">
                    <p className="text-gray-400 mb-2">Seus Níveis de Acesso:</p>
                    {roleDisplay}
                </div>

                {/* Área Condicional para a Diretoria */}
                {isDiretoria && (
                    <div className="p-4 border-l-4 border-red-500 bg-gray-700/50 mt-4">
                        <h4 className="text-lg font-semibold text-red-400">
                            Acesso de Diretoria Ativo
                        </h4>
                        <p className="text-gray-300">
                            Você tem permissão total para gerenciar Cadastros, Finanças e Configurações da Escola.
                        </p>
                    </div>
                )}
                
                {/* Futuramente, adicione chamadas a APIs para gráficos e KPIs */}
            </div>
        </div>
    );
};

export default Dashboard;