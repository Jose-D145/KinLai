// D:\ITKFA\src\pages\Gestao\FaixaManager.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import FaixaList from './FaixaList'; // Vai ser importado
import FaixaForm from './FaixaForm'; // Vai ser importado
import { timezone } from '../../utils/dateTime'; 

// Tipos base (deve refletir o modelo Django 'Faixa')
interface Faixa {
    id: number;
    escola: number;
    cor: string;
    grau: string;
    tempo_medio_graduacao: number; // Em dias
    elegivel_instrutor: boolean; // Novo campo
    data_desativacao: string | null;
    is_active: boolean; // Campo auxiliar
}

const FaixaManager: React.FC = () => {
    const { user } = useAuth(); 
    const [faixas, setFaixas] = useState<Faixa[]>([]);
    const [loading, setLoading] = useState(true);
    
    // 0 indica Inclusão (Novo), ID > 0 indica Edição.
    const [editingFaixaId, setEditingFaixaId] = useState<number | null>(null);
    const [selectedFaixaId, setSelectedFaixaId] = useState<number | null>(null);

    const API_URL = `/api/faixas/`;
    
    // Apenas a Diretoria pode gerenciar o CRUD
    const canManage = useMemo(() => user?.roles.includes('Diretoria'), [user]);

    const fetchFaixas = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            
            const dados = response.data.map((faixa: Faixa) => ({
                ...faixa,
                is_active: faixa.data_desativacao === null,
            }));
            setFaixas(dados);
        } catch (error) {
            toast.error("Erro ao carregar a lista de faixas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaixas();
    }, []);

    // Ação de Soft Delete/Ativação (PATCH)
    const toggleActive = async (faixaId: number, currentStatus: boolean) => {
        if (!canManage) return;

        const url = `${API_URL}${faixaId}/`;
        const patchData = {
            data_desativacao: currentStatus ? timezone.now() : null 
        };

        try {
            await api.patch(url, patchData);
            toast.success(`Faixa ${currentStatus ? 'desativada' : 'reativada'} com sucesso.`);
            fetchFaixas(); 
            setSelectedFaixaId(null);
        } catch (error) {
            toast.error("Erro ao alterar o status.");
        }
    };

    // Renderização
    if (!canManage) {
        return <div className="text-red-500 p-8">Acesso negado. Apenas Diretores podem gerenciar faixas.</div>;
    }
    
    if (editingFaixaId !== null) {
        const faixaData = editingFaixaId > 0 ? faixas.find(f => f.id === editingFaixaId) : undefined;
        
        return (
            <FaixaForm 
                initialData={faixaData} 
                onSave={fetchFaixas} 
                onCancel={() => setEditingFaixaId(null)} 
            />
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Gestão de Faixas e Graus</h2>
            
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-gray-700">
                <button 
                    onClick={() => setEditingFaixaId(0)} 
                    className="py-2 px-4 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 font-semibold"
                >
                    + Incluir Nova Faixa
                </button>
                
                {selectedFaixaId !== null && (
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => setEditingFaixaId(selectedFaixaId)} 
                            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Editar Cadastro
                        </button>
                        <button 
                            onClick={() => {
                                const faixa = faixas.find(f => f.id === selectedFaixaId);
                                if (faixa) toggleActive(faixa.id, faixa.is_active);
                            }} 
                            className={`py-2 px-4 rounded-md text-white ${faixas.find(f => f.id === selectedFaixaId)?.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {faixas.find(f => f.id === selectedFaixaId)?.is_active ? 'Desativar' : 'Reativar'}
                        </button>
                    </div>
                )}
            </div>
            
            {loading ? (
                <p className="text-gray-400">Carregando dados das faixas...</p>
            ) : (
                <FaixaList 
                    faixas={faixas} 
                    onSelectFaixa={setSelectedFaixaId}
                    selectedFaixaId={selectedFaixaId}
                    onEdit={setEditingFaixaId} 
                    onToggleActive={toggleActive}
                    canManage={canManage}
                />
            )}
        </div>
    );
};

export default FaixaManager;