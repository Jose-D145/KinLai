// src/pages/Gestao/InstrutorList.tsx

import React from 'react';

// Tipos base (deve corresponder aos dados retornados pela API /api/instrutores/)
interface Instrutor {
    aluno: number; // ID do Aluno vinculado (PK)
    nome_instrutor: string; // Campo calculado no Django (puxa o nome do Aluno)
    escola: number;
    diretoria: number | null;
    data_desativacao: string | null;
    is_active: boolean;
}

interface InstrutorListProps {
    instrutores: Instrutor[];
    onSelectInstrutor: (id: number) => void;
    selectedInstrutorId: number | null;
    onEdit: (id: number) => void;
    onToggleActive: (id: number, currentStatus: boolean) => void;
    canManage: boolean; // Permissão para mostrar botões de ação
}

const InstrutorList: React.FC<InstrutorListProps> = ({ 
    instrutores, 
    onSelectInstrutor, 
    selectedInstrutorId,
    onEdit,
    onToggleActive,
    canManage 
}) => {
    
    // Filtro básico para mostrar primeiro os instrutores ativos
    const sortedInstrutores = instrutores.sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 shadow-lg rounded-lg">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Nome do Instrutor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">ID Aluno (PK)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Gerente (Diretoria FK)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Data Desativação</th>
                        {canManage && <th className="px-6 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">Ações</th>}
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedInstrutores.map((instrutor) => (
                        <tr 
                            key={instrutor.aluno} // Usa o ID do Aluno como chave (PK)
                            className={`hover:bg-gray-700 transition-colors ${!instrutor.is_active ? 'opacity-60 bg-red-900/20' : ''}`}
                        >
                            {/* Checkbox de Seleção */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="radio"
                                    name="instrutor-select"
                                    checked={selectedInstrutorId === instrutor.aluno}
                                    onChange={() => onSelectInstrutor(instrutor.aluno)}
                                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded"
                                />
                            </td>
                            
                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    instrutor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {instrutor.is_active ? 'Ativo' : 'Desativado'}
                                </span>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{instrutor.nome_instrutor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{instrutor.aluno}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{instrutor.diretoria || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {instrutor.data_desativacao ? new Date(instrutor.data_desativacao).toLocaleDateString('pt-BR') : '-'}
                            </td>
                            
                            {/* Botões de Ação na Linha (Diretoria) */}
                            {canManage && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Botão Editar (Icone de Lápis) */}
                                    <button 
                                        onClick={() => onEdit(instrutor.aluno)}
                                        className="text-yellow-500 hover:text-yellow-400 mx-2"
                                        title="Editar Detalhes"
                                    >
                                        ✏️
                                    </button>
                                    {/* Botão Ativar/Desativar */}
                                    <button
                                        onClick={() => onToggleActive(instrutor.aluno, instrutor.is_active)}
                                        className={`text-white hover:opacity-80`}
                                        title={instrutor.is_active ? 'Desativar Instrutor' : 'Reativar Instrutor'}
                                        style={{ color: instrutor.is_active ? 'red' : 'green' }}
                                    >
                                        {instrutor.is_active ? '🚫' : '✅'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InstrutorList;