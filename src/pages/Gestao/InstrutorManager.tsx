// src/pages/Gestao/InstrutorManager.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
// Importe os componentes filhos (criaremos o List e Form a seguir)
import InstrutorList from './InstrutorList'; 
import InstrutorForm from './InstrutorForm'; 
import { timezone } from '../../utils/dateTime'; 

// Tipos base (Sincronizado com o modelo Django e API)
interface Instrutor {
    aluno: number; // ID do Aluno vinculado (PK no nosso modelo Django)
    nome_instrutor: string; // Campo calculado pelo Django
    escola: number;
    diretoria: number | null;
    data_desativacao: string | null;
    is_active: boolean;
}

const InstrutorManager: React.FC = () => {
    const { user } = useAuth(); 
    const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [editingInstrutorId, setEditingInstrutorId] = useState<number | null>(null);
    const [selectedInstrutorId, setSelectedInstrutorId] = useState<number | null>(null);

    const API_URL = `/api/instrutores/`;

    // Apenas a Diretoria pode gerenciar o CRUD
    const canManage = useMemo(() => user?.roles.includes('Diretoria'), [user]);
    
    // Carregamento Inicial (GET Listar)
    const fetchInstrutores = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            
            const dados = response.data.map((instrutor: Instrutor) => ({
                ...instrutor,
                is_active: instrutor.data_desativacao === null,
            }));
            setInstrutores(dados);
        } catch (error) {
            toast.error("Erro ao carregar a lista de instrutores.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstrutores();
    }, []);

    // Soft Delete (PATCH) - Lógica idêntica à do Aluno
    const toggleActive = async (instrutorId: number, currentStatus: boolean) => {
        if (!canManage) return;

        const url = `${API_URL}${instrutorId}/`;
        const patchData = {
            data_desativacao: currentStatus ? timezone.now() : null 
        };

        try {
            await api.patch(url, patchData);
            toast.success(`Instrutor ${currentStatus ? 'desativado' : 'reativado'} com sucesso.`);
            fetchInstrutores(); 
            setSelectedInstrutorId(null);
        } catch (error) {
            toast.error("Erro ao alterar o status.");
        }
    };

    // Renderização do Formulário ou da Lista
    if (!canManage) {
        return <div className="text-red-500 p-8">Acesso negado. Apenas Diretores podem gerenciar instrutores.</div>;
    }
    
    if (editingInstrutorId !== null) {
        // A chave primária (PK) do Instrutor é o ID do Aluno.
        const instrutorData = editingInstrutorId > 0 
            ? instrutores.find(a => a.aluno === editingInstrutorId) 
            : undefined;
        
        return (
            <InstrutorForm 
                initialData={instrutorData} 
                onSave={fetchInstrutores} // Recarrega a lista após salvar/promover
                onCancel={() => setEditingInstrutorId(null)} // Volta para a lista
            />
        );
    }

// Renderização da Lista (Padrão)
    return (
        <div className="p-4">
            {/* ... Botões e Header ... */}
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-gray-700">
                <button onClick={() => setEditingInstrutorId(0)} className="py-2 px-4 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 font-semibold">
                    + Incluir Novo Instrutor
                </button>
                {/* Botões de Ação (Editar/Desativar) */}
                {selectedInstrutorId !== null && (
                    <div className="flex space-x-3">
                        <button onClick={() => setEditingInstrutorId(selectedInstrutorId)} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Editar Detalhes
                        </button>
                        {/* ... Botão Toggle Active ... */}
                    </div>
                )}
            </div>

            {loading ? (
                <p className="text-gray-400">Carregando dados dos instrutores...</p>
            ) : (
                // RENDERIZAÇÃO DA LISTA
                <InstrutorList 
                    instrutores={instrutores} 
                    onSelectInstrutor={setSelectedInstrutorId}
                    selectedInstrutorId={selectedInstrutorId}
                    onEdit={setEditingInstrutorId} 
                    onToggleActive={toggleActive}
                    canManage={canManage}
                />
            )}
        </div>
    );
};

export default InstrutorManager;