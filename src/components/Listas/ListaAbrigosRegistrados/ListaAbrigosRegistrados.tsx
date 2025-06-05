"use client";

import React from "react";
import CaixaAbrigo from "@/components/CaixasInformacoes/CaixaAbrigo/CaixaAbrigo";
import { ListaAbrigosCadastradosProps } from "@/types/types";

export default function ListaAbrigosCadastrados({
    abrigos,
    isDeletingAbrigo,
    onExcluirAbrigo,
    isLoadingAbrigos,
    selectedCidadeId,
    className = "lg:col-span-2 p-6 bg-white rounded-xl shadow-xl border border-gray-200 h-full", // Mesmo estilo de card
}: ListaAbrigosCadastradosProps) {
    if (!selectedCidadeId) {
        return (
            <section className={className}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Abrigos Cadastrados</h2>
                <p className="text-center text-gray-600 mt-4">Por favor, selecione uma cidade no filtro para visualizar os abrigos.</p>
            </section>
        );
    }

    if (isLoadingAbrigos) {
        return (
            <section className={className}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Abrigos Cadastrados</h2>
                <p className="text-center text-gray-600 mt-4">Buscando abrigos...</p>
            </section>
        );
    }

    if (abrigos.length === 0) {
        return (
            <section className={className}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Abrigos Cadastrados</h2>
                <p className="text-center text-gray-600 mt-4">Nenhum abrigo cadastrado para esta cidade.</p>
            </section>
        );
    }

    return (
        <section className={className}>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Abrigos Cadastrados</h2>

            <div className="max-h-[calc(100vh-22rem)] sm:max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {abrigos.map((abrigo) => (
                    <CaixaAbrigo key={abrigo.idAbrigo} abrigo={abrigo} idAbrigoSendoExcluido={isDeletingAbrigo} onExcluir={onExcluirAbrigo} />
                ))}
            </div>
        </section>
    );
}
