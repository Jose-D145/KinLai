// src/pages/Gestao/InstrutorForm.tsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Tipos base (Simplificados para a submissão)
interface InstrutorFormData {
    aluno: number | null; // ID do Aluno vinculado (PK no modelo Instrutor)
    // REMOVIDO: diretoria: number | null; 
    escola: number; // ID da Escola
}

// Tipo para a lista de Alunos a serem promovidos
interface AlunoElegivel {
    id: number;
    nome: string;
    nome_faixa: string;
}

interface InstrutorFormProps {
    initialData?: InstrutorFormData;
    onSave: () => void;
    onCancel: () => void;
}

const InstrutorForm: React.FC<InstrutorFormProps> = ({ initialData, onSave, onCancel }) => {
    
    // MOCK: ID da Escola (em um app real, seria pego do AuthContext)
    const MOCK_SCHOOL_ID = 1; 

    const [formData, setFormData] = useState<InstrutorFormData>(initialData || {
        aluno: null,
        escola: MOCK_SCHOOL_ID, // Mantém a escola para a criação do registro
    });
    
    const [alunosElegiveis, setAlunosElegiveis] = useState<AlunoElegivel[]>([]);
    const [loadingRelations, setLoadingRelations] = useState(true);

    const isEdit = !!initialData?.aluno; // A PK do Instrutor é o ID do Aluno

 // -----------------------------------------------------------
    // Efeito: Carregar Lista de Alunos Elegíveis
    // -----------------------------------------------------------
    useEffect(() => {
        const fetchRelations = async () => {
            try {
                // ALTERAÇÃO AQUI: Chamando o novo endpoint customizado no Django
                const response = await api.get('/api/alunos/elegiveis/'); 
                
                setAlunosElegiveis(response.data); 
            } catch (error) {
                toast.error("Erro ao carregar a lista de alunos elegíveis. Verifique a configuração das faixas no Admin.");
                console.error("Erro API:", error);
            } finally {
                setLoadingRelations(false);
            }
        };

        fetchRelations();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Converte ID para número
            [name]: (name === 'aluno' && value !== "") ? parseInt(value) : (value === "" ? null : value)
        }));
    };

    // -----------------------------------------------------------
    // Submissão: POST (Criação) ou PUT (Edição)
    // -----------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.aluno) {
            toast.error("Selecione um aluno para promover.");
            return;
        }

        try {
            if (isEdit) {
                // Edição: Apenas atualiza o registro do Instrutor (PUT)
                await api.put(`/api/instrutores/${formData.aluno}/`, formData);
                toast.success("Dados do instrutor atualizados!");
            } else {
                // PROMOÇÃO (POST)
                await api.post('/api/instrutores/', formData);
                toast.success("Aluno promovido a Instrutor com sucesso!");
            }
            onSave(); // Aciona o recarregamento da lista
        } catch (error) {
            toast.error("Falha ao promover. Verifique se o aluno já é instrutor.");
            console.error("Erro na Submissão:", error.response?.data || error);
        }
    };

    if (loadingRelations) {
        return <p>Carregando formulário...</p>;
    }

    // -----------------------------------------------------------
    // Renderização do Formulário
    // -----------------------------------------------------------
    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">{isEdit ? 'Editar Detalhes do Instrutor' : 'Promover Aluno a Instrutor'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Seleção do Aluno (Apenas habilitado na Criação) */}
                <div>
                    <label className="block text-sm font-medium text-gray-400">Aluno a Promover</label>
                    <select
                        name="aluno"
                        value={formData.aluno || ''}
                        onChange={handleChange}
                        required
                        disabled={isEdit} // Não pode mudar o aluno em modo de edição
                        className={`mt-1 block w-full p-2 bg-gray-700 border rounded-md text-white ${isEdit ? 'opacity-50' : ''}`}
                    >
                        <option value="">-- Selecione o Aluno Elegível --</option>
                        {alunosElegiveis.map(aluno => (
                            <option key={aluno.id} value={aluno.id}>
                                {aluno.nome} ({aluno.nome_faixa})
                            </option>
                        ))}
                    </select>
                </div>

                {/* O CAMPO ID DA DIRETORIA FOI REMOVIDO DAQUI */}
                
                {/* Ações */}
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">
                        Cancelar
                    </button>
                    <button type="submit" className="py-2 px-4 bg-yellow-500 rounded-md text-gray-900 font-semibold hover:bg-yellow-600">
                        {/* NOVO TEXTO DO BOTÃO */}
                        {isEdit ? 'Salvar Detalhes' : 'Promover Aluno'} 
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InstrutorForm;