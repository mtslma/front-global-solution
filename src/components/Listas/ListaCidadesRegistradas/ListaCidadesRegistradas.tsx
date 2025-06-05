"use client";

import React from "react";
import CaixaCidade from "@/components/CaixasInformacoes/CaixaCidade/CaixaCidade";
import { ListaCidadesCadastradasProps } from "@/types/types";

export default function ListaCidadesCadastradas({ cidades, isDeleting, onExcluirCidade, className = "lg:col-span-2 p-6 bg-white rounded-xl shadow-xl border border-gray-200 h-full", error }: ListaCidadesCadastradasProps) {
    return (
        <section className={className}>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Cidades Cadastradas</h2>

            {cidades.length === 0 && !error && <p className="text-center text-gray-600 mt-4">Nenhuma cidade cadastrada.</p>}

            {cidades.length > 0 && (
                <div className="max-h-[calc(100vh-22rem)] sm:max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    {" "}
                    {/* Altura ajustada */}
                    {cidades.map((cidade) => (
                        <CaixaCidade
                            key={cidade.idCidade} // A key é essencial aqui para o React
                            cidade={cidade}
                            idCidadeSendoExcluida={isDeleting}
                            onExcluir={onExcluirCidade}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
