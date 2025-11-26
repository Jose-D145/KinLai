// src/pages/Gestao/GestaoCentral.tsx 

import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const GestaoCentral: React.FC = () => {
    const location = useLocation();
    
    // Links para os Modelos de Gestão
    const managementLinks = [
        { path: 'alunos', name: 'Alunos' },
        { path: 'instrutores', name: 'Instrutores/Professores' },
        { path: 'faixas', name: 'Faixas e Graus' },
        { path: 'equipamentos', name: 'Equipamentos' },
        { path: 'programas', name: 'Programas de Treinamento' },
        // ... adicione outras tabelas aqui
    ];

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                Gestão de Cadastros (Diretoria)
            </h3>
            
            {/* Sub-Menu de Navegação */}
            <nav className="flex space-x-4 mb-6 border-b border-yellow-500/50 pb-2">
                {managementLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => 
                            `py-1 px-3 text-sm font-semibold transition-colors duration-200 ${
                                isActive ? 'bg-yellow-600 text-black rounded-full' : 'text-gray-400 hover:text-yellow-500'
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
            
            {/* Área de Conteúdo Aninhada */}
            <div className="flex-grow">
                {/* Se estiver no path '/cadastros', renderiza uma mensagem de boas-vindas */}
                {location.pathname.endsWith('/cadastros') && (
                    <div className="text-gray-400 p-4 border rounded">
                        Selecione uma das categorias acima (Alunos, Faixas, etc.) para iniciar a gestão CRUD.
                    </div>
                )}
                
                {/* O Outlet renderiza o AlunoManager, FaixaManager, etc. */}
                <Outlet /> 
            </div>
        </div>
    );
};

export default GestaoCentral;