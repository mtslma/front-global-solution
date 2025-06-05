"use client";

import React from "react";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { CaixaOcorrenciaProps } from "@/types/types";
import { formatarCepDisplay, getNivelGravidadeClasses } from "@/services/formatar-campos";

export default function CaixaOcorrencia({ ocorrencia, idOcorrenciaSendoExcluida, onExcluir }: CaixaOcorrenciaProps) {
    const ocorrenciaIdComoString = String(ocorrencia.idOcorrencia);
    const estaSendoExcluida = idOcorrenciaSendoExcluida === ocorrenciaIdComoString;

    return (
        <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-slate-50 hover:shadow-lg transition-shadow duration-150 ease-in-out">
            <div className="flex justify-between items-start">
                <div className="flex-grow pr-3">
                    {/* Tipo da Ocorrência */}
                    <h3 className="text-lg font-semibold text-indigo-700 break-words">{ocorrencia.tipoOcorrencia || "Tipo não informado"}</h3>

                    {/* Data da Ocorrência */}
                    <p className="text-sm text-gray-600 mt-1">
                        Data de registro: <span className="font-medium text-gray-700">{ocorrencia.dataCriacao ? new Date(ocorrencia.dataCriacao).toLocaleString() : "Não informada"}</span>
                    </p>

                    {/* CEP da Ocorrência (formatado e condicional) */}
                    {ocorrencia.cep && (
                        <p className="text-sm text-gray-600">
                            CEP: <span className="font-medium text-gray-700">{formatarCepDisplay(ocorrencia.cep) || "Não informado"}</span>
                        </p>
                    )}

                    {/* Localização (Latitude e Longitude) */}
                    <p className="text-sm text-gray-600">
                        Localização:{" "}
                        <span className="font-medium text-gray-700">
                            Lat: {typeof ocorrencia.lat === "number" ? ocorrencia.lat.toFixed(5) : "N/A"}, Lon: {typeof ocorrencia.lon === "number" ? ocorrencia.lon.toFixed(5) : "N/A"}
                        </span>
                    </p>

                    {/* Nível de Gravidade */}
                    <p className="text-sm text-gray-600 mt-2">
                        Gravidade: <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getNivelGravidadeClasses(ocorrencia.nivelGravidade)}`}>{ocorrencia.nivelGravidade || "Não informada"}</span>
                    </p>

                    {/* ID da Ocorrência */}
                    <p className="text-xs text-gray-400 mt-1">ID: {ocorrencia.idOcorrencia}</p>
                </div>

                {/* Botão de Excluir (renderizado condicionalmente) */}
                {onExcluir && (
                    <button
                        onClick={() => onExcluir(ocorrenciaIdComoString)}
                        disabled={estaSendoExcluida}
                        title="Excluir Ocorrência"
                        aria-label="Excluir Ocorrência"
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
