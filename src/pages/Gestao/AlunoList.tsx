// src/pages/Gestao/AlunoList.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Tipos base (devem corresponder aos tipos em AlunoManager.tsx)
interface Aluno {
    id: number;
    nome: string;
    data_inicio: string;
    situacao_financeira: string;
    nome_faixa: string;
    data_desativacao: string | null;
    is_active: boolean;
}

interface AlunoListProps {
    alunos: Aluno[];
    onSelectAluno: (id: number) => void;
    selectedAlunoId: number | null;
    onEdit: (id: number) => void;
    onToggleActive: (id: number, currentStatus: boolean) => void;
    canManage: boolean; // Permissão para mostrar botões de ação na linha
}

const AlunoList: React.FC<AlunoListProps> = ({ 
    alunos, 
    onSelectAluno, 
    selectedAlunoId,
    onEdit,
    onToggleActive,
    canManage // Diretores
}) => {
    
    // Filtro básico para mostrar primeiro os alunos ativos
    const sortedAlunos = alunos.sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 shadow-lg rounded-lg">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Faixa Atual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Início</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Financeiro</th>
                        {canManage && <th className="px-6 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">Ações</th>}
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedAlunos.map((aluno) => (
                        <tr 
                            key={aluno.id} 
                            className={`hover:bg-gray-700 transition-colors ${!aluno.is_active ? 'opacity-60 bg-red-900/20' : ''}`}
                        >
                            {/* Checkbox de Seleção */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="radio"
                                    name="aluno-select"
                                    checked={selectedAlunoId === aluno.id}
                                    onChange={() => onSelectAluno(aluno.id)}
                                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded"
                                />
                            </td>
                            
                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    aluno.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {aluno.is_active ? 'Ativo' : 'Desativado'}
                                </span>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{aluno.nome}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{aluno.nome_faixa}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(aluno.data_inicio).toLocaleDateString('pt-BR')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{aluno.situacao_financeira}</td>
                            
                            {/* Botões de Ação na Linha (Diretoria) */}
                            {canManage && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* Botão Editar (Icone de Lápis) */}
                                    <button 
                                        onClick={() => onEdit(aluno.id)}
                                        className="text-yellow-500 hover:text-yellow-400 mx-2"
                                        title="Editar Cadastro"
                                    >
                                        ✏️
                                    </button>

                                    {/* Botão Ativar/Desativar */}
                                    <button
                                        onClick={() => onToggleActive(aluno.id, aluno.is_active)}
                                        className={`text-white hover:opacity-80`}
                                        title={aluno.is_active ? 'Desativar Registro' : 'Reativar Registro'}
                                        style={{ color: aluno.is_active ? 'red' : 'green' }}
                                    >
                                        {aluno.is_active ? '🚫' : '✅'}
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

export default AlunoList;