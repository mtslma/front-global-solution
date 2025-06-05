"use client";

import React, { useState, useEffect, useCallback } from "react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { API_BASE, API_KEY } from "@/services/api-config";
import { SubmitHandler } from "react-hook-form";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import CustomAlert from "@/components/CustomAlert/CustomAlert";
import Link from "next/link";
import { Cidade, NovaOcorrenciaFormData, Ocorrencia } from "@/types/types";

import RegistrarOcorrenciaForm from "@/components/Formularios/RegistrarOcorrenciaForm/RegistrarOcorrenciaForm";
import ListaOcorrenciasRegistradas from "@/components/Listas/ListaOcorrenciasRegistradas/ListaOcorrenciasRegistradas";

// Helper para extrair mensagens de erro da API
async function getApiErrorMessage(response: Response, defaultMessage: string): Promise<string> {
    try {
        const errorContent = await response.json();
        return errorContent.message || errorContent.detail || errorContent.error || JSON.stringify(errorContent);
    } catch {
        // Se não for JSON, tenta como texto
        const textContent = await response.text();
        return textContent || defaultMessage;
    }
}

export default function OcorrenciasPage() {
    // Estados de dados
    const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
    const [selectedCidadeIdParaFiltro, setSelectedCidadeIdParaFiltro] = useState<string | null>(null);
    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);

    // Estados de UI e controle
    const [isLoadingCidades, setIsLoadingCidades] = useState(true);
    const [isLoadingOcorrencias, setIsLoadingOcorrencias] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingOcorrenciaId, setIsDeletingOcorrenciaId] = useState<string | null>(null); // Feedback visual no item
    const [pageError, setPageError] = useState<string | null>(null);

    // Estados para AlertPopup (notificações)
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estados para CustomAlert (confirmação de exclusão)
    const [isConfirmDeleteOcorrenciaOpen, setIsConfirmDeleteOcorrenciaOpen] = useState(false);
    const [ocorrenciaIdParaExcluirState, setOcorrenciaIdParaExcluirState] = useState<string | null>(null);

    // Exibe notificações (sucesso/erro/info)
    const showNotificationPopup = useCallback((message: string, type: "success" | "error" | "info", duration = 4000) => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), duration);
    }, []);

    // Busca todas as cidades para filtros e formulários
    const fetchAllCidades = useCallback(async (): Promise<Cidade[]> => {
        try {
            const response = await fetch(`${API_BASE}/cidade/search`, {
                method: "GET",
                headers: { "x-api-key": API_KEY },
            });
            if (!response.ok) {
                const apiErrorMsg = await getApiErrorMessage(response, "Falha ao buscar lista de cidades.");
                throw new Error(apiErrorMsg);
            }
            const responseJSON = await response.json();
            return responseJSON?.data?.filter((cidade: Cidade) => !cidade.deleted) || [];
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao buscar cidades";
            showNotificationPopup(`Erro ao carregar cidades: ${message}`, "error");
            if (todasCidades.length === 0) setPageError(message);
            return [];
        }
    }, [showNotificationPopup, todasCidades.length]);

    // Busca ocorrências por cidade selecionada
    const buscarOcorrenciasPorCidade = useCallback(
        async (idCidade: string) => {
            if (!idCidade) {
                setOcorrencias([]);
                return;
            }
            setIsLoadingOcorrencias(true);
            try {
                const response = await fetch(`${API_BASE}/ocorrencia/cidade/${idCidade}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                });
                if (!response.ok) {
                    const apiErrorMsg = await getApiErrorMessage(response, `Erro ao buscar ocorrências para a cidade ID ${idCidade}.`);
                    throw new Error(apiErrorMsg);
                }
                const responseBody = await response.json();
                const mapOcorrenciaData = (data: Ocorrencia[]): Ocorrencia[] =>
                    data
                        .map(
                            (item: Ocorrencia): Ocorrencia => ({
                                idOcorrencia: item.idOcorrencia || String(Math.random()), // ATENÇÃO: ID aleatório é um fallback arriscado
                                deleted: item.deleted || false,
                                dataCriacao: item.dataCriacao || new Date().toISOString(),
                                lat: typeof item.lat === "string" ? parseFloat(item.lat) : item.lat || 0,
                                lon: typeof item.lon === "string" ? parseFloat(item.lon) : item.lon || 0,
                                tipoOcorrencia: item.tipoOcorrencia || "Não informado",
                                nivelGravidade: item.nivelGravidade || "Não informado",
                                idCidade: typeof item.idCidade === "string" ? parseInt(item.idCidade, 10) : item.idCidade,
                                cep: item.cep || "Não informado",
                            })
                        )
                        .filter((o: Ocorrencia) => !o.deleted);

                if (responseBody && Array.isArray(responseBody.data)) {
                    setOcorrencias(mapOcorrenciaData(responseBody.data));
                } else if (responseBody && Array.isArray(responseBody)) {
                    setOcorrencias(mapOcorrenciaData(responseBody));
                } else {
                    setOcorrencias([]);
                    console.warn("API retornou dados em formato inesperado para ocorrências.", responseBody);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Erro desconhecido ao buscar ocorrências.";
                showNotificationPopup(`Erro ao buscar ocorrências: ${message}`, "error");
                setOcorrencias([]);
            } finally {
                setIsLoadingOcorrencias(false);
            }
        },
        [showNotificationPopup]
    );

    // Efeito para carregar cidades na montagem
    useEffect(() => {
        const carregarCidadesIniciais = async () => {
            setIsLoadingCidades(true);
            setPageError(null); // Limpa erro de página ao tentar recarregar
            const cidadesFetched = await fetchAllCidades();
            setTodasCidades(cidadesFetched);
            setIsLoadingCidades(false);
        };
        carregarCidadesIniciais();
    }, [fetchAllCidades]);

    // Efeito para buscar ocorrências ao mudar o filtro de cidade
    useEffect(() => {
        if (selectedCidadeIdParaFiltro) {
            buscarOcorrenciasPorCidade(selectedCidadeIdParaFiltro);
        } else {
            setOcorrencias([]);
        }
    }, [selectedCidadeIdParaFiltro, buscarOcorrenciasPorCidade]);

    // Submete o formulário de nova ocorrência
    const handleRegistrarOcorrencia: SubmitHandler<NovaOcorrenciaFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                idCidade: parseInt(data.idCidade, 10),
                tipoOcorrencia: data.tipoOcorrencia,
                nivelGravidade: data.nivelGravidade,
                cep: data.cep,
            };
            const response = await fetch(`${API_BASE}/ocorrencia/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify(payload),
            });
            if (response.ok || response.status === 201) {
                showNotificationPopup("Ocorrência registrada com sucesso!", "success");
                if (selectedCidadeIdParaFiltro && payload.idCidade === parseInt(selectedCidadeIdParaFiltro, 10)) {
                    buscarOcorrenciasPorCidade(selectedCidadeIdParaFiltro);
                }
                // Reset do formulário é feito dentro do RegistrarOcorrenciaForm
            } else {
                const errorMsg = await getApiErrorMessage(response, "Erro ao registrar ocorrência.");
                showNotificationPopup(errorMsg, "error");
                console.error("Erro ao registrar ocorrência:", errorMsg, `Status: ${response.status}`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao registrar ocorrência.";
            showNotificationPopup(`Erro de conexão: ${message}`, "error");
            console.error("Erro de conexão ao registrar ocorrência:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Abre o diálogo de confirmação para excluir uma ocorrência
    const promptExcluirOcorrencia = (idOcorrencia: string) => {
        setOcorrenciaIdParaExcluirState(idOcorrencia);
        setIsConfirmDeleteOcorrenciaOpen(true);
    };

    // Executa a exclusão da ocorrência após confirmação
    const executarExclusaoOcorrenciaConfirmada = async () => {
        if (!ocorrenciaIdParaExcluirState) return;

        setIsDeletingOcorrenciaId(ocorrenciaIdParaExcluirState); // Feedback visual no item
        try {
            const response = await fetch(`${API_BASE}/ocorrencia/${ocorrenciaIdParaExcluirState}`, {
                method: "DELETE",
                headers: { "x-api-key": API_KEY },
            });
            if (response.ok) {
                showNotificationPopup("Ocorrência excluída com sucesso!", "success");
                if (selectedCidadeIdParaFiltro) {
                    buscarOcorrenciasPorCidade(selectedCidadeIdParaFiltro);
                } else {
                    setOcorrencias((prev) => prev.filter((o) => o.idOcorrencia !== ocorrenciaIdParaExcluirState));
                }
            } else {
                const errorMsg = await getApiErrorMessage(response, "Erro ao excluir ocorrência.");
                showNotificationPopup(errorMsg, "error");
                console.error("Erro ao excluir ocorrência:", errorMsg, `Status: ${response.status}`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao excluir ocorrência.";
            showNotificationPopup(`Erro de conexão: ${message}`, "error");
            console.error("Erro de conexão ao excluir ocorrência:", err);
        } finally {
            setIsDeletingOcorrenciaId(null);
            // O CustomAlert já lida com o fechamento do modal e reset do ID via onClose
        }
    };

    // Renderização condicional para carregamento inicial ou erro crítico
    if (isLoadingCidades && todasCidades.length === 0 && !pageError) return <LoadingPage />;
    if (pageError && todasCidades.length === 0) return <ErrorPage error={`Falha ao carregar dados iniciais: ${pageError}`} />;

    return (
        <main className="min-h-screen bg-slate-100 text-gray-800 font-sans p-4 sm:p-8">
            <div className="w-full max-w-7xl mx-auto">
                {/* Popup para notificações gerais */}
                <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
                {/* Popup para confirmação de exclusão */}
                <CustomAlert
                    isOpen={isConfirmDeleteOcorrenciaOpen}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
                    onClose={() => {
                        setIsConfirmDeleteOcorrenciaOpen(false);
                        setOcorrenciaIdParaExcluirState(null);
                    }}
                    onConfirm={executarExclusaoOcorrenciaConfirmada}
                    confirmButtonText="Excluir"
                    cancelButtonText="Cancelar"
                />

                {/* Cabeçalho da página */}
                <div className="flex flex-col items-center md:relative mb-8 py-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 order-2 md:order-1">Gerenciar Ocorrências</h1>
                    <div className="w-full md:absolute md:top-1/2 md:-translate-y-1/2 md:left-0 flex justify-center md:justify-start mt-4 md:mt-0 order-1 md:order-2">
                        <Link href={"/perfil"} className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm font-medium">
                            <i className="fas fa-arrow-left size-4"></i>
                            <span>Voltar para Perfil</span>
                        </Link>
                    </div>
                </div>

                {/* Conteúdo principal: Filtro/Lista e Formulário */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filtro de ocorrências por cidade */}
                        <div className="p-4 bg-white rounded-lg shadow">
                            <label htmlFor="cidade-select-filter" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Filtrar Ocorrências por Cidade: {/* Label corrigido */}
                            </label>
                            <select id="cidade-select-filter" value={selectedCidadeIdParaFiltro || ""} onChange={(e) => setSelectedCidadeIdParaFiltro(e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base" disabled={isLoadingCidades || todasCidades.length === 0}>
                                <option value="" disabled={isLoadingCidades || todasCidades.length > 0}>
                                    {isLoadingCidades ? "Carregando cidades..." : todasCidades.length === 0 ? "Nenhuma cidade encontrada" : "Selecione uma cidade"}
                                </option>
                                {todasCidades.map((cidade) => (
                                    <option key={cidade.idCidade} value={cidade.idCidade.toString()}>
                                        {cidade.nomeCidade}
                                    </option>
                                ))}
                            </select>
                            {pageError && todasCidades.length === 0 && !isLoadingCidades && <p className="text-red-500 text-xs sm:text-sm mt-2">{pageError}</p>}
                        </div>
                        {/* Lista de ocorrências registradas */}
                        <ListaOcorrenciasRegistradas
                            ocorrencias={ocorrencias}
                            isDeletingOcorrenciaId={deletingOcorrenciaId} // Nome da prop para o estado de exclusão do item
                            onExcluirOcorrencia={promptExcluirOcorrencia} // Função que abre o modal de confirmação
                            isLoadingOcorrencias={isLoadingOcorrencias}
                            selectedCidadeId={selectedCidadeIdParaFiltro}
                        />
                    </div>
                    {/* Formulário para registrar nova ocorrência */}
                    <RegistrarOcorrenciaForm onFormSubmit={handleRegistrarOcorrencia} isSubmitting={isSubmitting} todasCidades={todasCidades} />
                </div>
            </div>
        </main>
    );
}
