import React from "react";
import { Cidade } from "@/types/types"; 

interface SelectorCidadeProps {
    cidades: Cidade[];
    cidadeSelecionada: Cidade | null;
    handleCidadeSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    isLoading: boolean; 
}

export default function SelectorCidade({ cidades, cidadeSelecionada, handleCidadeSelectChange, isLoading }: SelectorCidadeProps) {
    return (
        <>
            <p className="text-gray-600 text-sm mb-4 flex-shrink-0">Selecione um local para explorar:</p>
            {cidades.length > 0 ? (
                <select value={cidadeSelecionada?.idCidade ? String(cidadeSelecionada.idCidade) : ""} onChange={handleCidadeSelectChange} className="w-full py-2.5 px-3.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white appearance-none mb-5 flex-shrink-0" aria-label="Selecionar cidade">
                    {/* Opção padrão "Selecione uma cidade" */}
                    <option value="" disabled={!!cidadeSelecionada} hidden={!!cidadeSelecionada}>
                        Selecione uma cidade
                    </option>
                    {cidades.map((cidade) => (
                        <option key={cidade.idCidade} value={String(cidade.idCidade)}>
                            {cidade.nomeCidade}
                        </option>
                    ))}
                </select>
            ) : (
                // Mensagem se não houver cidades carregadas da API
                !isLoading && <p className="text-gray-500 mb-4 flex-shrink-0">Nenhuma cidade disponível para seleção.</p>
            )}
        </>
    );
}
