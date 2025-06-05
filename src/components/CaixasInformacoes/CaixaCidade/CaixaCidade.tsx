"use client";

import React from "react";
import { CaixaCidadeProps } from "@/types/types";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { formatarCepDisplay } from "@/services/formatar-campos";

export default function CaixaCidade({ cidade, idCidadeSendoExcluida, onExcluir }: CaixaCidadeProps) {
    const estaSendoExcluida = idCidadeSendoExcluida === cidade.idCidade;

    return (
        <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-slate-50 hover:shadow-lg transition-shadow duration-150 ease-in-out">
            <div className="flex justify-between items-start">
                {/* Div para agrupar os detalhes da cidade, permitindo crescimento e espaçamento */}
                <div className="flex-grow pr-3">
                    {/* Nome da Cidade */}
                    <h3 className="text-lg font-semibold text-indigo-700 break-words">{cidade.nomeCidade || "Nome não informado"}</h3>

                    {/* CEP da Cidade (formatado) */}
                    <p className="text-sm text-gray-600 mt-1">
                        CEP: <span className="font-medium text-gray-700">{formatarCepDisplay(cidade.cepCidade) || "N/A"}</span>
                    </p>

                    {/* Latitude e Longitude */}
                    <p className="text-sm text-gray-600 mt-1">
                        Localização:{" "}
                        <span className="font-medium text-gray-700">
                            Lat: {typeof cidade.lat === "number" ? cidade.lat.toFixed(4) : "N/A"}, Lon: {typeof cidade.lon === "number" ? cidade.lon.toFixed(4) : "N/A"}
                        </span>
                    </p>

                    {/* Quantidade de Ocorrências e Abrigos */}
                    <p className="text-sm text-gray-600 mt-1">
                        Ocorrências: <span className="font-medium text-gray-700">{cidade.quantidadeOcorrencias ?? 0}</span> | Abrigos: <span className="font-medium text-gray-700">{cidade.quantidadeAbrigos ?? 0}</span>
                    </p>

                    {/* ID da Cidade */}
                    <p className="text-xs text-gray-400 mt-1">ID: {cidade.idCidade}</p>
                </div>

                {/* Botão de exclusão (renderizado condicionalmente) */}
                {onExcluir && (
                    <button
                        onClick={() => onExcluir(cidade.idCidade)}
                        disabled={estaSendoExcluida}
                        title="Excluir Cidade"
                        aria-label="Excluir Cidade"
                        className={`p-2 h-9 w-9 flex items-center justify-center rounded-md transition-colors duration-150 shadow-sm hover:cursor-pointer
                                ${estaSendoExcluida ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
                    >
                        {estaSendoExcluida ? <LoadingSpinner size={18} /> : <i className="fa-solid fa-trash text-sm"></i>}
                    </button>
                )}
            </div>
        </div>
    );
}
