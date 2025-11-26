// src/pages/Gestao/AlunoManager.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import AlunoList from './AlunoList'; 
import AlunoForm from './AlunoForm'; // Agora importamos o formulário
import { timezone } from '../../utils/dateTime'; 

// -----------------------------------------------------------
// 1. INTERFACE ÚNICA E COMPLETA (Substitui Aluno e AlunoFormData)
// Esta interface deve conter TODOS os campos do modelo Django.
// -----------------------------------------------------------
interface Aluno {
    id: number;
    nome: string;
    data_inicio: string;
    tipo: string; // Campo necessário para o formulário
    situacao_financeira: string;
    faixa_atual: number | null; // Campo FK necessário para o formulário
    escola: number; // Campo FK necessário para o formulário
    
    // Campos da API e Soft Delete
    nome_faixa: string; 
    data_desativacao: string | null; 
    is_active: boolean; 
}

const AlunoManager: React.FC = () => {
    const { user } = useAuth(); 
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    
    // 0 indica Inclusão (Novo), ID > 0 indica Edição. null indica Listagem.
    const [editingAlunoId, setEditingAlunoId] = useState<number | null>(null);
    const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);

    const API_URL = `/api/alunos/`;

    // -----------------------------------------------------------
    // Lógica 1: Permissões
    // -----------------------------------------------------------
    const canManage = useMemo(() => user?.roles.includes('Diretoria'), [user]);
    
    // -----------------------------------------------------------
    // Lógica 2: Carregamento Inicial (GET Listar)
    // -----------------------------------------------------------
    const fetchAlunos = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            
            const dados = response.data.map((aluno: Aluno) => ({
                ...aluno,
                is_active: aluno.data_desativacao === null,
            }));
            setAlunos(dados);
        } catch (error) {
            toast.error("Erro ao carregar a lista de alunos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlunos();
    }, []);

    // -----------------------------------------------------------
    // Lógica 3: Ação de Soft Delete/Ativação (PATCH)
    // -----------------------------------------------------------
    const toggleActive = async (alunoId: number, currentStatus: boolean) => {
        if (!canManage) {
            toast.error("Permissão negada. Apenas Diretoria pode alterar o status.");
            return;
        }

        const url = `${API_URL}${alunoId}/`;
        
        const patchData = {
            // Se estava ativo, envia data (desativa). Se estava inativo, envia null (reativa).
            data_desativacao: currentStatus ? timezone.now() : null
        };

        try {
            await api.patch(url, patchData);
            toast.success(`Aluno ${currentStatus ? 'desativado' : 'reativado'} com sucesso.`);
            fetchAlunos(); 
            setSelectedAlunoId(null); 
        } catch (error) {
            toast.error("Erro ao alterar o status.");
        }
    };

    // -----------------------------------------------------------
    // Renderização
    // -----------------------------------------------------------

    if (!canManage) {
        return <div className="text-red-500 p-8">Acesso negado. Apenas Diretores podem gerenciar cadastros.</div>;
    }
    
    // Renderiza o Formulário
    if (editingAlunoId !== null) {
        // Agora, alunoData é do tipo Aluno e é compatível com as props do formulário.
        const alunoData = editingAlunoId > 0 ? alunos.find(a => a.id === editingAlunoId) : undefined;
        
        return (
            <AlunoForm 
                // Não precisa de casting!
                initialData={alunoData} 
                onSave={fetchAlunos} 
                onCancel={() => setEditingAlunoId(null)} 
            />
        );
    }

    // Renderiza a Lista (Padrão)
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Gestão de Alunos</h2>
            
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-gray-700">
                <button 
                    onClick={() => setEditingAlunoId(0)} 
                    className="py-2 px-4 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 font-semibold"
                >
                    + Incluir Novo Aluno
                </button>
                
                {/* Botões de Ação na Área de Gestão */}
                <div className="flex space-x-3">
                    {selectedAlunoId !== null && (
                        <>
                            <button 
                                onClick={() => setEditingAlunoId(selectedAlunoId)} 
                                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Editar Cadastro
                            </button>
                            <button 
                                onClick={() => {
                                    const aluno = alunos.find(a => a.id === selectedAlunoId);
                                    if (aluno) toggleActive(aluno.id, aluno.is_active);
                                }} 
                                className={`py-2 px-4 rounded-md text-white ${alunos.find(a => a.id === selectedAlunoId)?.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {alunos.find(a => a.id === selectedAlunoId)?.is_active ? 'Desativar' : 'Reativar'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {loading ? (
                <p className="text-gray-400">Carregando dados dos alunos...</p>
            ) : (
                <AlunoList 
                    alunos={alunos} 
                    onSelectAluno={setSelectedAlunoId}
                    selectedAlunoId={selectedAlunoId}
                    onEdit={setEditingAlunoId} 
                    onToggleActive={toggleActive}
                    canManage={canManage} 
                />
            )}
        </div>
    );
};

export default AlunoManager;