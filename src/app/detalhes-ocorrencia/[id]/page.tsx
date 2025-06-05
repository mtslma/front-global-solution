"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Ocorrencia } from "@/types/types";
import { API_BASE, API_KEY } from "@/services/api-config";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import Link from "next/link";
import { getDetalhesSeveridade, getVisualizacaoTipoOcorrencia } from "@/services/formatar-campos";

// Importa dinamicamente o LocalOcorrenciaMapa
const DynamicLocalOcorrenciaMapa = dynamic(() => import("@/components/LocalOcorrenciaMapa/LocalOcorrenciaMapa"), {
    ssr: false, // Garante que o componente só renderize no cliente
    loading: () => (
        // Placeholder enquanto o mapa carrega
        <div className="h-[200px] sm:h-[250px] md:h-[280px] w-full flex justify-center items-center bg-slate-100 rounded-lg">
            <p className="text-slate-500">Carregando mapa...</p>
        </div>
    ),
});

const formatarTipoOcorrencia = (tipo?: string): string => {
    if (!tipo) return "Não Informado";
    return tipo.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function DetalhesOcorrenciaPage() {
    const params = useParams();
    const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

    const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const buscarDetalhesOcorrencia = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/ocorrencia/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            });

            if (!response.ok) {
                const erroMsg = await response.text();
                try {
                    const erroJson = JSON.parse(erroMsg);
                    throw new Error(erroJson.message || erroJson.error || `Erro ${response.status}.`);
                } catch {
                    throw new Error(erroMsg || `Erro ${response.status}.`);
                }
            }
            const responseBody = await response.json();
            if (responseBody?.data) {
                setOcorrencia(responseBody.data);
            } else if (responseBody && Object.keys(responseBody).length > 0 && !responseBody.data) {
                setOcorrencia(responseBody);
            } else {
                setError("Ocorrência não encontrada ou resposta inválida.");
                setOcorrencia(null);
            }
        } catch (err) {
            console.error(`Falha ao buscar ocorrência ID ${id}:`, err);
            setError(err instanceof Error ? err.message : "Erro desconhecido.");
            setOcorrencia(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (idParam) {
            buscarDetalhesOcorrencia(idParam as string);
        } else {
            setError("ID da ocorrência não fornecido.");
            setLoading(false);
        }
    }, [idParam, buscarDetalhesOcorrencia]);

    if (loading) return <LoadingPage />;
    if (error || !ocorrencia) return <ErrorPage error={error || "Detalhes não puderam ser carregados."} />;

    const detalhesSeveridade = getDetalhesSeveridade(ocorrencia.nivelGravidade);
    const visualizacaoTipo = getVisualizacaoTipoOcorrencia(ocorrencia.tipoOcorrencia);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8 sm:py-12 px-4">
            <main className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
                <header className={`p-6 sm:p-8 border-b-4 ${detalhesSeveridade.bordaCor}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <i className={`${visualizacaoTipo.iconeClasseFA} ${visualizacaoTipo.corClasseIcone} text-4xl sm:text-5xl`}></i>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">{formatarTipoOcorrencia(ocorrencia.tipoOcorrencia)}</h1>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${detalhesSeveridade.bgCor} ${detalhesSeveridade.textoCor} shadow-sm`}>
                            <i className={`fa-solid ${detalhesSeveridade.iconeFA} fa-fw`}></i>
                            Nível: {detalhesSeveridade.etiqueta}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-600 text-sm">
                        <p className="flex items-center gap-2">
                            <i className="fa-solid fa-calendar-days fa-fw"></i>
                            Registrado: {new Date(ocorrencia.dataCriacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="flex items-center gap-2">
                            <i className="fa-solid fa-hashtag fa-fw"></i>
                            ID: {ocorrencia.idOcorrencia}
                        </p>
                    </div>
                </header>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="md:col-span-1">
                        <h2 className="text-xl font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-map-location-dot fa-fw text-indigo-600"></i>
                            Localização
                        </h2>

                        <div className="h-[250px] sm:h-[280px] md:h-[300px] w-full rounded-lg overflow-hidden border-2 border-indigo-200 shadow-md">
                            <DynamicLocalOcorrenciaMapa ocorrencia={ocorrencia} />
                        </div>
                    </section>

                    <section className="md:col-span-1 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <i className="fa-solid fa-circle-info fa-fw text-indigo-600"></i>
                                Dados da Ocorrência
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-3 text-sm text-slate-700">
                                <p>
                                    <strong>Latitude:</strong> <span className="font-mono">{ocorrencia.lat.toFixed(6)}</span>
                                </p>
                                <p>
                                    <strong>Longitude:</strong> <span className="font-mono">{ocorrencia.lon.toFixed(6)}</span>
                                </p>
                                <p>
                                    <strong>ID da Cidade Vinculada:</strong> {ocorrencia.idCidade}
                                </p>
                                <p>
                                    <strong>Status Administrativo:</strong>
                                    {ocorrencia.deleted ? <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Excluída</span> : <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Ativa</span>}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 border-t border-slate-200 text-center">
                            <Link href="/mapa" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors hover:shadow-lg">
                                <i className="fa-solid fa-arrow-left mr-2"></i>
                                Voltar para o mapa
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
