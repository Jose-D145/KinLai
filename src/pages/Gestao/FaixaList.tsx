// D:\ITKFA\src\pages\Gestao\FaixaList.tsx

import React from 'react';

// Tipos base (Idêntico ao FaixaManager.tsx)
interface Faixa {
    id: number;
    escola: number;
    cor: string;
    grau: string;
    tempo_medio_graduacao: number; // Em dias
    elegivel_instrutor: boolean; // Novo campo
    data_desativacao: string | null;
    is_active: boolean; 
}

interface FaixaListProps {
    faixas: Faixa[];
    onSelectFaixa: (id: number) => void;
    selectedFaixaId: number | null;
    onEdit: (id: number) => void;
    onToggleActive: (id: number, currentStatus: boolean) => void;
    canManage: boolean;
}

const FaixaList: React.FC<FaixaListProps> = ({ 
    faixas, 
    onSelectFaixa, 
    selectedFaixaId,
    onEdit,
    onToggleActive,
    canManage 
}) => {
    
    const sortedFaixas = faixas.sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1));

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 shadow-lg rounded-lg">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Cor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Grau</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Tempo Mín. (Dias)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Elegível Instrutor</th>
                        {canManage && <th className="px-6 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">Ações</th>}
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {sortedFaixas.map((faixa) => (
                        <tr 
                            key={faixa.id} 
                            className={`hover:bg-gray-700 transition-colors ${!faixa.is_active ? 'opacity-60 bg-red-900/20' : ''}`}
                        >
                            {/* Checkbox de Seleção */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="radio"
                                    name="faixa-select"
                                    checked={selectedFaixaId === faixa.id}
                                    onChange={() => onSelectFaixa(faixa.id)}
                                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded"
                                />
                            </td>
                            
                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    faixa.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {faixa.is_active ? 'Ativa' : 'Desativada'}
                                </span>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{faixa.cor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{faixa.grau}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{faixa.tempo_medio_graduacao}</td>
                            
                            {/* Elegível Instrutor */}
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                {faixa.elegivel_instrutor ? '✅ Sim' : '❌ Não'}
                            </td>
                            
                            {/* Botões de Ação na Linha (Diretoria) */}
                            {canManage && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => onEdit(faixa.id)}
                                        className="text-yellow-500 hover:text-yellow-400 mx-2"
                                        title="Editar Cadastro"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => onToggleActive(faixa.id, faixa.is_active)}
                                        className={`text-white hover:opacity-80`}
                                        title={faixa.is_active ? 'Desativar Faixa' : 'Reativar Faixa'}
                                        style={{ color: faixa.is_active ? 'red' : 'green' }}
                                    >
                                        {faixa.is_active ? '🚫' : '✅'}
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

export default FaixaList;