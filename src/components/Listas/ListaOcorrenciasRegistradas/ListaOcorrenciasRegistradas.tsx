"use client";

import CaixaOcorrencia from "@/components/CaixasInformacoes/CaixaOcorrencia/CaixaOcorrencia";
import { Ocorrencia } from "@/types/types";

interface ListaOcorrenciasRegistradasProps {
    ocorrencias: Ocorrencia[];
    isDeletingOcorrenciaId: string | null;
    onExcluirOcorrencia?: (idOcorrencia: string) => void;
    isLoadingOcorrencias: boolean;
    selectedCidadeId: string | null;
    className?: string;
}

export default function ListaOcorrenciasRegistradas({ ocorrencias, isDeletingOcorrenciaId, onExcluirOcorrencia, isLoadingOcorrencias, selectedCidadeId, className = "lg:col-span-2 p-6 bg-white rounded-xl shadow-xl border border-gray-200 h-full" }: ListaOcorrenciasRegistradasProps) {
    if (!selectedCidadeId) {
        return (
            <section className={className}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Ocorrências Registradas</h2>
                <p className="text-center text-gray-600 mt-4">Por favor, selecione uma cidade no filtro para visualizar as ocorrências.</p>
            </section>
        );
    }

    if (isLoadingOcorrencias) {
        return (
            <section className={className}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Ocorrências Registradas</h2>
                <p className="text-center text-gray-600 mt-4">Buscando ocorrências...</p>
            </section>
        );
    }

    if (ocorrencias.length === 0) {
        return (
            <section className={className}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Ocorrências Registradas</h2>
                <p className="text-center text-gray-600 mt-4">Nenhuma ocorrência registrada para esta cidade.</p>
            </section>
        );
    }

    return (
        <section className={className}>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Ocorrências Registradas</h2>

            <div className="max-h-[calc(100vh-22rem)] sm:max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {ocorrencias.map((ocorrencia) => (
                    <CaixaOcorrencia key={ocorrencia.idOcorrencia} ocorrencia={ocorrencia} idOcorrenciaSendoExcluida={isDeletingOcorrenciaId} onExcluir={onExcluirOcorrencia} />
                ))}
            </div>
        </section>
    );
}
