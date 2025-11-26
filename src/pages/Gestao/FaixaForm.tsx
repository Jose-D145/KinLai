// D:\ITKFA\src\pages\Gestao\FaixaForm.tsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Tipos base (Idêntico ao FaixaManager.tsx)
interface FaixaFormData {
    id?: number;
    escola: number;
    cor: string;
    grau: string;
    tempo_medio_graduacao: number | ''; 
    elegivel_instrutor: boolean; 
}

interface FaixaFormProps {
    initialData?: FaixaFormData;
    onSave: () => void;
    onCancel: () => void;
}

const FaixaForm: React.FC<FaixaFormProps> = ({ initialData, onSave, onCancel }) => {
    
    const isEdit = !!initialData?.id;
    const MOCK_SCHOOL_ID = 1; 

    // Inicializa o estado
    const [formData, setFormData] = useState<FaixaFormData>(initialData || {
        escola: MOCK_SCHOOL_ID,
        cor: '',
        grau: '',
        tempo_medio_graduacao: '', 
        elegivel_instrutor: false,
    });

    const API_URL = '/api/faixas/';
    
    // Função para tratar mudanças de input (texto e número)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'tempo_medio_graduacao' && value !== '') ? parseInt(value) : value 
        }));
    };

    // Submissão: POST (Inclusão) ou PUT (Edição)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Verifica se os campos numéricos estão vazios
        if (formData.tempo_medio_graduacao === '') {
            toast.error("O campo Tempo Mínimo (Dias) é obrigatório.");
            return;
        }

        try {
            if (isEdit && formData.id) {
                // EDIÇÃO (PUT)
                await api.put(`${API_URL}${formData.id}/`, formData);
                toast.success("Faixa atualizada com sucesso!");
            } else {
                // INCLUSÃO (POST)
                await api.post(API_URL, formData);
                toast.success("Nova faixa incluída com sucesso!");
            }
            onSave(); // Aciona o reload da lista
        } catch (error) {
            toast.error("Falha ao salvar. Verifique a unicidade ou campos.");
            console.error("Erro na Submissão:", error.response?.data || error);
        }
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">{isEdit ? 'Editar Detalhes da Faixa' : 'Incluir Nova Faixa'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Linha 1: Cor e Grau */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Cor da Faixa</label>
                        <input
                            type="text"
                            name="cor"
                            value={formData.cor}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Grau/Nível (Ex: 1º Kyu, 1º Duan)</label>
                        <input
                            type="text"
                            name="grau"
                            value={formData.grau}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        />
                    </div>
                </div>

                {/* Linha 2: Tempo Mínimo */}
                <div>
                    <label className="block text-sm font-medium text-gray-400">Tempo Mínimo de Permanência (Dias)</label>
                    <input
                        type="number"
                        name="tempo_medio_graduacao"
                        value={formData.tempo_medio_graduacao}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                </div>
                
                {/* Linha 3: Elegibilidade (Checkbox) */}
                <div className="flex items-center pt-2">
                    <input
                        type="checkbox"
                        id="elegivel_instrutor"
                        name="elegivel_instrutor"
                        checked={formData.elegivel_instrutor}
                        onChange={handleChange}
                        className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded"
                    />
                    <label htmlFor="elegivel_instrutor" className="ml-3 text-sm font-medium text-gray-300">
                        Esta faixa é elegível para promoção a Instrutor?
                    </label>
                </div>
                
                {/* Ações */}
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">
                        Cancelar
                    </button>
                    <button type="submit" className="py-2 px-4 bg-yellow-500 rounded-md text-gray-900 font-semibold hover:bg-yellow-600">
                        {isEdit ? 'Salvar Faixa' : 'Incluir Faixa'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FaixaForm;