// src/pages/Gestao/AlunoForm.tsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Tipos base (sincronizado com AlunoManager.tsx)
interface AlunoFormData {
    id?: number; // Opcional para inclusão
    nome: string;
    data_inicio: string;
    tipo: string;
    situacao_financeira: string;
    faixa_atual: number | null; // ID da Faixa
    escola: number; // ID da Escola (Deve ser pego do contexto/URL, aqui será fixo por enquanto)
}

interface Faixa {
    id: number;
    cor: string;
    grau: string;
}

interface AlunoFormProps {
    initialData?: AlunoFormData;
    onSave: () => void;
    onCancel: () => void;
}

const AlunoForm: React.FC<AlunoFormProps> = ({ initialData, onSave, onCancel }) => {
    // -----------------------------------------------------------
    // Estado
    // -----------------------------------------------------------
    const [formData, setFormData] = useState<AlunoFormData>(initialData || {
        nome: '',
        data_inicio: new Date().toISOString().split('T')[0], // Data no formato YYYY-MM-DD
        tipo: 'Mensalista',
        situacao_financeira: 'Em dia',
        faixa_atual: null,
        escola: 1, // MOCK: Assumimos ID 1 para a escola logada
    });
    const [faixas, setFaixas] = useState<Faixa[]>([]);
    const [loadingRelations, setLoadingRelations] = useState(true);

    const isEdit = !!initialData?.id;

    // -----------------------------------------------------------
    // Efeito: Carregar Faixas e Dados Relacionados
    // -----------------------------------------------------------
    useEffect(() => {
        const fetchRelations = async () => {
            try {
                // 1. Busca a lista de faixas para o dropdown
                const response = await api.get('/api/faixas/');
                setFaixas(response.data);

            } catch (error) {
                toast.error("Erro ao carregar dados relacionados (Faixas).");
            } finally {
                setLoadingRelations(false);
            }
        };

        fetchRelations();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'faixa_atual' && value !== "") ? parseInt(value) : value // Converte ID de Faixa para número
        }));
    };

    // -----------------------------------------------------------
    // Submissão: POST (Inclusão) ou PUT/PATCH (Edição)
    // -----------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const dataToSend = {
            ...formData,
            // Certifique-se de que faixa_atual não é null se for necessário
            faixa_atual: formData.faixa_atual || null 
        };

        try {
            if (isEdit && formData.id) {
                // Edição
                await api.put(`/api/alunos/${formData.id}/`, dataToSend);
                toast.success("Aluno atualizado com sucesso!");
            } else {
                // Inclusão
                await api.post('/api/alunos/', dataToSend);
                toast.success("Novo aluno incluído com sucesso!");
            }
            onSave(); // Chama a função de callback para recarregar a lista
        } catch (error) {
            toast.error("Falha ao salvar. Verifique se os dados estão completos.");
            console.error("Erro na Submissão:", error);
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
            <h3 className="text-xl font-bold mb-6 text-yellow-400">{isEdit ? 'Editar Cadastro de Aluno' : 'Incluir Novo Aluno'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Linha 1: Nome */}
                <div>
                    <label className="block text-sm font-medium text-gray-400">Nome Completo</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                </div>

                {/* Linha 2: Data Início e Tipo */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Data de Início</label>
                        <input
                            type="date"
                            name="data_inicio"
                            value={formData.data_inicio}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Tipo de Inscrição</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        >
                            <option value="Mensalista">Mensalista</option>
                            <option value="Bolsista">Bolsista</option>
                        </select>
                    </div>
                </div>

                {/* Linha 3: Faixa Atual e Situação Financeira */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Faixa Atual</label>
                        <select
                            name="faixa_atual"
                            value={formData.faixa_atual || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        >
                            <option value="">-- Selecione a Faixa --</option>
                            {faixas.map(faixa => (
                                <option key={faixa.id} value={faixa.id}>
                                    {faixa.cor} ({faixa.grau})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Situação Financeira</label>
                        <input
                            type="text"
                            name="situacao_financeira"
                            value={formData.situacao_financeira}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                    </div>
                </div>
                
                {/* Ações */}
                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-yellow-500 rounded-md text-gray-900 font-semibold hover:bg-yellow-600"
                    >
                        {isEdit ? 'Salvar Alterações' : 'Incluir Cadastro'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AlunoForm;