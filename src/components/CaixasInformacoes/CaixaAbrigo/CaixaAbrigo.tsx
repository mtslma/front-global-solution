"use client";

import { CaixaAbrigoProps } from "@/types/types";
import React from "react";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { formatarCepDisplay, formatarTelefoneDisplay, getStatusFuncionamentoClasses } from "@/services/formatar-campos";

// Componente para exibir as informações de um único abrigo em um "card" ou "caixa".
export default function CaixaAbrigo({ abrigo, idAbrigoSendoExcluido, onExcluir }: CaixaAbrigoProps) {
    const abrigoIdComoString = String(abrigo.idAbrigo);
    const estaSendoExcluida = idAbrigoSendoExcluido === abrigoIdComoString;

    // Função para determinar classes da badge de Nível de Segurança
    const getNivelSegurancaClasses = (nivel: string | undefined): string => {
        switch (nivel?.toUpperCase()) {
            case "ALTO": // Risco Alto
                return "bg-red-100 text-red-800 border border-red-200";
            case "MÉDIO": // Risco Médio
                return "bg-amber-100 text-amber-800 border border-amber-200";
            case "BAIXO": // Risco Baixo
                return "bg-green-100 text-green-800 border border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    return (
        <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-slate-50 hover:shadow-lg transition-shadow duration-150 ease-in-out">
            <div className="flex justify-between items-start">
                <div className="flex-grow pr-3">
                    <h3 className="text-lg font-semibold text-indigo-700 break-words">{abrigo.nomeAbrigo || "Nome não informado"}</h3>

                    <p className="text-sm text-gray-600 mt-1">
                        Endereço: <span className="font-medium text-gray-700">{abrigo.enderecoAbrigo || "Não informado"}</span>
                    </p>

                    {/* CEP formatado */}
                    <p className="text-sm text-gray-600">
                        CEP: <span className="font-medium text-gray-700">{formatarCepDisplay(abrigo.cep) || "Não informado"}</span>
                    </p>

                    <p className="text-sm text-gray-600">
                        Capacidade: <span className="font-medium text-gray-700">{abrigo.capacidadeMaxima?.toString() || "Não informada"}</span>
                    </p>

                    {/* Telefone de contato formatado */}
                    <p className="text-sm text-gray-600">
                        Telefone: <span className="font-medium text-gray-700">{formatarTelefoneDisplay(abrigo.telefoneContato) || "Não informado"}</span>
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                        Status: <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusFuncionamentoClasses(abrigo.statusFuncionamento)}`}>{abrigo.statusFuncionamento || "Não informado"}</span>
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                        {" "}
                        {/* Ajustado para mt-1 para consistência se necessário, ou manter como estava se o espaçamento for intencional */}
                        Segurança: <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelSegurancaClasses(abrigo.nivelSegurancaAtual)}`}>{abrigo.nivelSegurancaAtual || "Não informado"}</span>
                    </p>

                    <p className="text-xs text-gray-400 mt-1">ID: {abrigo.idAbrigo}</p>
                </div>

                {onExcluir && (
                    <button
                        onClick={() => onExcluir(abrigoIdComoString)}
                        disabled={estaSendoExcluida}
                        title="Excluir Abrigo"
                        aria-label="Excluir Abrigo"
                        className={`p-2 h-9 w-9 flex items-center hover:cursor-pointer justify-center rounded-md transition-colors duration-150 shadow-sm flex-shrink-0
                            ${estaSendoExcluida ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
                    >
                        {estaSendoExcluida ? <LoadingSpinner size={18} /> : <i className="fa-solid fa-trash text-sm"></i>}
                    </button>
                )}
            </div>
        </div>
    );
}
