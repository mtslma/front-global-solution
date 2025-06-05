"use client";

import React, { useState, useEffect, useCallback } from "react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { API_BASE, API_KEY } from "@/services/api-config";
import { Cidade, NovaCidadeFormData } from "@/types/types";
import { SubmitHandler } from "react-hook-form";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import CustomAlert from "@/components/CustomAlert/CustomAlert";
import ListaCidadesCadastradas from "@/components/Listas/ListaCidadesRegistradas/ListaCidadesRegistradas";
import RegistrarCidadeForm from "@/components/Formularios/RegistrarCidadeForm/RegistrarCidadeForm";
import Link from "next/link";

// Helper para extrair mensagens de erro da API de forma mais detalhada
async function getApiErrorMessage(response: Response, defaultMessage: string): Promise<string> {
    const textContent = await response.text();
    return textContent || defaultMessage;
}

export default function CidadesPage() {
    // Estados de dados
    const [cidades, setCidades] = useState<Cidade[]>([]);

    // Estados de UI e controle
    const [isLoading, setIsLoading] = useState(true); // Carregamento inicial da página
    const [isSubmitting, setIsSubmitting] = useState(false); // Submissão do formulário de registro
    const [deletingCidadeId, setIsDeletingCidadeId] = useState<string | null>(null); // Feedback visual no item da lista
    const [pageError, setPageError] = useState<string | null>(null); // Erro geral da página

    // Estados para AlertPopup (notificações)
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estados para CustomAlert (confirmação de exclusão de cidade)
    const [isConfirmDeleteCidadeOpen, setIsConfirmDeleteCidadeOpen] = useState(false);
    const [cidadeIdParaExcluirState, setCidadeIdParaExcluirState] = useState<string | null>(null);

    // Exibe notificações (sucesso/erro/info)
    const showNotificationPopup = useCallback((message: string, type: "success" | "error" | "info", duration = 4000) => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), duration);
    }, []);

    // Busca a lista de cidades da API
    const buscarCidades = useCallback(
        async (isInitialLoad = false) => {
            if (isInitialLoad) setPageError(null);
            try {
                const response = await fetch(`${API_BASE}/cidade/search`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                });
                if (!response.ok) {
                    const apiErrorMsg = await getApiErrorMessage(response, "Erro ao buscar cidades.");
                    throw new Error(apiErrorMsg);
                }
                const responseBody = await response.json();
                if (responseBody && Array.isArray(responseBody.data)) {
                    setCidades(responseBody.data.filter((c: Cidade) => !c.deleted).map((c: Cidade) => ({ ...c, zoomPadrao: c.zoomPadrao || 13 })));
                } else {
                    throw new Error("A API retornou dados em um formato inesperado para cidades.");
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
                if (isInitialLoad) {
                    setPageError(message);
                } else {
                    showNotificationPopup(`Erro ao atualizar lista de cidades: ${message}`, "error");
                }
                console.error("Erro ao buscar cidades:", err);
            }
        },
        [showNotificationPopup]
    );

    // Efeito para carregar dados iniciais
    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            await buscarCidades(true);
            setIsLoading(false);
        };
        carregarDados();
    }, [buscarCidades]);

    // Submete o formulário de nova cidade
    const handleRegistrarCidade: SubmitHandler<NovaCidadeFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE}/cidade/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify({ cep: data.cep.replace(/\D/g, "") }),
            });
            if (response.ok || response.status === 201) {
                showNotificationPopup("Cidade registrada com sucesso!", "success");
                await buscarCidades(); // Atualiza a lista
            } else {
                const errorMsg = await getApiErrorMessage(response, "Erro ao registrar cidade.");
                showNotificationPopup(errorMsg, "error");
                console.error("Erro ao registrar cidade:", errorMsg);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao registrar cidade.";
            showNotificationPopup(`Erro de conexão: ${message}`, "error");
            console.error("Erro de conexão ao registrar cidade:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Abre o diálogo de confirmação para excluir uma cidade
    const promptExcluirCidade = (idCidade: string) => {
        setCidadeIdParaExcluirState(idCidade);
        setIsConfirmDeleteCidadeOpen(true);
    };

    // Executa a exclusão da cidade após confirmação
    const executarExclusaoCidadeConfirmada = async () => {
        if (!cidadeIdParaExcluirState) return;

        setIsDeletingCidadeId(cidadeIdParaExcluirState); // Feedback visual no item
        try {
            const response = await fetch(`${API_BASE}/cidade/${cidadeIdParaExcluirState}`, {
                method: "DELETE",
                headers: { "x-api-key": API_KEY },
            });
            if (response.ok) {
                showNotificationPopup("Cidade excluída com sucesso!", "success");
                await buscarCidades(); // Atualiza a lista
            } else {
                const errorMsg = await getApiErrorMessage(response, "Erro ao excluir cidade.");
                showNotificationPopup(errorMsg, "error");
                console.error("Erro ao excluir cidade:", errorMsg);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao excluir cidade.";
            showNotificationPopup(`Erro de conexão: ${message}`, "error");
            console.error("Erro de conexão ao excluir cidade:", err);
        } finally {
            setIsDeletingCidadeId(null);
            // Fechamento do modal e reset do ID são feitos no onClose do CustomAlert
        }
    };

    // Renderização condicional para carregamento ou erro crítico
    if (isLoading) return <LoadingPage />;
    if (pageError && cidades.length === 0) return <ErrorPage error={pageError} />;

    return (
        <main className="min-h-screen bg-slate-100 text-gray-800 font-sans p-4 sm:p-8">
            <div className="w-full max-w-7xl mx-auto">
                {/* Popup para notificações gerais */}
                <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
                {/* Popup para confirmação de exclusão de cidade */}
                <CustomAlert
                    isOpen={isConfirmDeleteCidadeOpen}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir esta cidade? Esta ação não pode ser desfeita e pode afetar abrigos e ocorrências associadas."
                    onClose={() => {
                        setIsConfirmDeleteCidadeOpen(false);
                        setCidadeIdParaExcluirState(null);
                    }}
                    onConfirm={executarExclusaoCidadeConfirmada}
                    confirmButtonText="Excluir"
                    cancelButtonText="Cancelar"
                />

                <header className="flex flex-col items-center md:relative mb-8 py-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 order-2 md:order-1">Gerenciar Cidades</h1>
                    <div className="w-full md:absolute md:top-1/2 md:-translate-y-1/2 md:left-0 flex justify-center md:justify-start mt-4 md:mt-0 order-1 md:order-2">
                        <Link href={"/perfil"} className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm font-medium">
                            <i className="fas fa-arrow-left size-4"></i>
                            <span>Voltar para Perfil</span>
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Lista de cidades cadastradas */}
                    <ListaCidadesCadastradas
                        cidades={cidades}
                        isDeleting={deletingCidadeId} // Estado para feedback visual no item sendo excluído
                        onExcluirCidade={promptExcluirCidade} // Função que abre o modal de confirmação
                        error={pageError} // Para exibir erros relacionados à lista, se houver
                    />
                    {/* Formulário para registrar nova cidade */}
                    <RegistrarCidadeForm onFormSubmit={handleRegistrarCidade} isSubmitting={isSubmitting} />
                </div>
            </div>
        </main>
    );
}
