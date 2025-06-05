"use client";

import React, { useState, useEffect, useCallback } from "react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { API_BASE, API_KEY } from "@/services/api-config";
import { SubmitHandler } from "react-hook-form";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import CustomAlert from "@/components/CustomAlert/CustomAlert";
import Link from "next/link";
import { Abrigo, Cidade, NovoAbrigoFormData } from "@/types/types";
import RegistrarAbrigoForm from "@/components/Formularios/RegistrarAbrigoForm/RegistrarAbrigoForm";
import ListaAbrigosCadastrados from "@/components/Listas/ListaAbrigosRegistrados/ListaAbrigosRegistrados";

// Helper para extrair mensagens de erro da API de forma mais detalhada
async function getApiErrorMessage(response: Response, defaultMessage: string): Promise<string> {
    try {
        const errorContent = await response.json();
        return errorContent.message || errorContent.detail || errorContent.error || JSON.stringify(errorContent);
    } catch {
        const textContent = await response.text();
        return textContent || defaultMessage;
    }
}

export default function AbrigosPage() {
    // Estados de dados principais
    const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
    const [selectedCidadeIdParaFiltro, setSelectedCidadeIdParaFiltro] = useState<string | null>(null);
    const [abrigos, setAbrigos] = useState<Abrigo[]>([]);

    // Estados de controle de UI (loading, erros, popups)
    const [isLoadingCidades, setIsLoadingCidades] = useState(true);
    const [isLoadingAbrigos, setIsLoadingAbrigos] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingAbrigoId, setDeletingAbrigoId] = useState<string | null>(null); // Para feedback no item da lista
    const [pageError, setPageError] = useState<string | null>(null); // Erro geral da página

    // Estados para o AlertPopup de notificações
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estados para o CustomAlert de confirmação de exclusão
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [abrigoIdParaExcluir, setAbrigoIdParaExcluir] = useState<string | null>(null);

    // Exibe notificações (sucesso, erro, info)
    const showNotificationPopup = useCallback((message: string, type: "success" | "error" | "info", duration = 4000) => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), duration);
    }, []);

    // Busca todas as cidades para preencher o select de filtro e o formulário de registro
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
            console.error("Erro ao buscar lista de cidades:", err);
            const message = err instanceof Error ? err.message : "Erro desconhecido ao buscar cidades";
            showNotificationPopup(`Erro ao carregar cidades: ${message}`, "error");
            // Define o erro de página se o carregamento inicial de cidades falhar criticamente
            if (todasCidades.length === 0) setPageError(message);
            return [];
        }
    }, [showNotificationPopup, todasCidades.length]); // Adicionado todasCidades.length para reavaliar pageError

    // Busca abrigos com base na cidade selecionada no filtro
    const buscarAbrigosPorCidade = useCallback(
        async (idCidade: string) => {
            if (!idCidade) {
                setAbrigos([]);
                return;
            }
            setIsLoadingAbrigos(true);
            try {
                const response = await fetch(`${API_BASE}/abrigo/cidade/${idCidade}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                });
                if (!response.ok) {
                    const apiErrorMsg = await getApiErrorMessage(response, `Erro ao buscar abrigos para a cidade ID ${idCidade}.`);
                    throw new Error(apiErrorMsg);
                }
                const responseBody = await response.json();
                const mapAbrigoData = (data: Abrigo[]): Abrigo[] =>
                    data
                        .map((abrigo: Abrigo) => ({
                            ...abrigo,
                            // ATENÇÃO: Usar Math.random() para ID pode ser problemático se IDs da API forem ausentes e necessários para operações futuras.
                            idAbrigo: abrigo.idAbrigo || String(Math.random()),
                        }))
                        .filter((a: Abrigo) => !a.deleted);

                if (responseBody && Array.isArray(responseBody.data)) {
                    setAbrigos(mapAbrigoData(responseBody.data));
                } else if (responseBody && Array.isArray(responseBody)) {
                    setAbrigos(mapAbrigoData(responseBody));
                } else {
                    setAbrigos([]);
                    console.warn("API retornou dados em formato inesperado para abrigos.", responseBody);
                }
            } catch (err) {
                console.error("Erro ao buscar abrigos:", err);
                const message = err instanceof Error ? err.message : "Erro desconhecido ao buscar abrigos.";
                showNotificationPopup(`Erro ao buscar abrigos: ${message}`, "error");
                setAbrigos([]);
            } finally {
                setIsLoadingAbrigos(false);
            }
        },
        [showNotificationPopup]
    );

    // Carrega cidades na montagem do componente
    useEffect(() => {
        const carregarCidadesIniciais = async () => {
            setIsLoadingCidades(true);
            setPageError(null);
            const cidadesFetched = await fetchAllCidades();
            setTodasCidades(cidadesFetched);
            setIsLoadingCidades(false);
        };
        carregarCidadesIniciais();
    }, [fetchAllCidades]); // Executa se fetchAllCidades mudar (que é estável devido ao useCallback com deps estáveis)

    // Busca abrigos quando o filtro de cidade é alterado
    useEffect(() => {
        if (selectedCidadeIdParaFiltro) {
            buscarAbrigosPorCidade(selectedCidadeIdParaFiltro);
        } else {
            setAbrigos([]); // Limpa abrigos se nenhum filtro de cidade estiver ativo
        }
    }, [selectedCidadeIdParaFiltro, buscarAbrigosPorCidade]);

    // Submete o formulário de novo abrigo
    const handleRegistrarAbrigo: SubmitHandler<NovoAbrigoFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                idCidade: parseInt(data.idCidade, 10),
                nomeAbrigo: data.nomeAbrigo,
                cep: data.cep.replace(/\D/g, ""),
                capacidadeMaxima: parseInt(data.capacidadeMaxima, 10),
                enderecoAbrigo: data.enderecoAbrigo,
                telefoneContato: data.telefoneContato.replace(/\D/g, ""),
                statusFuncionamento: data.statusFuncionamento,
                nivelSegurancaAtual: data.nivelSegurancaAtual,
            };
            const response = await fetch(`${API_BASE}/abrigo/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify(payload),
            });
            if (response.ok || response.status === 201) {
                showNotificationPopup("Abrigo registrado com sucesso!", "success");
                if (selectedCidadeIdParaFiltro && payload.idCidade === parseInt(selectedCidadeIdParaFiltro, 10)) {
                    buscarAbrigosPorCidade(selectedCidadeIdParaFiltro);
                }
                // O formulário é resetado internamente pelo RegistrarAbrigoForm
            } else {
                const errorMsg = await getApiErrorMessage(response, "Erro ao registrar abrigo.");
                showNotificationPopup(errorMsg, "error");
                console.error("Erro ao registrar abrigo:", errorMsg);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao registrar abrigo.";
            showNotificationPopup(`Erro de conexão: ${message}`, "error");
            console.error("Erro de conexão ao registrar abrigo:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Abre o diálogo de confirmação para excluir um abrigo
    const promptExcluirAbrigo = (idAbrigo: string) => {
        setAbrigoIdParaExcluir(idAbrigo);
        setIsConfirmDeleteOpen(true);
    };

    // Executa a exclusão do abrigo após confirmação do usuário
    const executarExclusaoConfirmada = async () => {
        if (!abrigoIdParaExcluir) return;

        setDeletingAbrigoId(abrigoIdParaExcluir); // Feedback visual no item da lista
        // O fechamento do modal e reset do ID são feitos no onClose do CustomAlert

        try {
            const response = await fetch(`${API_BASE}/abrigo/${abrigoIdParaExcluir}`, {
                method: "DELETE",
                headers: { "x-api-key": API_KEY },
            });
            if (response.ok) {
                showNotificationPopup("Abrigo excluído com sucesso!", "success");
                if (selectedCidadeIdParaFiltro) {
                    buscarAbrigosPorCidade(selectedCidadeIdParaFiltro);
                } else {
                    // Se não houver filtro, idealmente buscar todos os abrigos novamente ou remover localmente
                    setAbrigos((prev) => prev.filter((a) => a.idAbrigo !== abrigoIdParaExcluir));
                }
            } else {
                const errorMsg = await getApiErrorMessage(response, "Erro ao excluir abrigo.");
                showNotificationPopup(errorMsg, "error");
                console.error("Erro ao excluir abrigo:", errorMsg);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao excluir abrigo.";
            showNotificationPopup(`Erro de conexão: ${message}`, "error");
            console.error("Erro de conexão ao excluir abrigo:", err);
        } finally {
            setDeletingAbrigoId(null);
        }
    };

    // Renderização condicional para estados de carregamento ou erro globais
    if (isLoadingCidades && todasCidades.length === 0 && !pageError) return <LoadingPage />;
    if (pageError && todasCidades.length === 0) return <ErrorPage error={pageError} />;

    return (
        <main className="min-h-screen bg-slate-100 text-gray-800 font-sans p-4 sm:p-8">
            <div className="w-full max-w-7xl mx-auto">
                <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
                <CustomAlert
                    isOpen={isConfirmDeleteOpen}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir este abrigo? Esta ação não pode ser desfeita."
                    onClose={() => {
                        setIsConfirmDeleteOpen(false);
                        setAbrigoIdParaExcluir(null);
                    }}
                    onConfirm={executarExclusaoConfirmada}
                    confirmButtonText="Excluir"
                    cancelButtonText="Cancelar"
                />

                <div className="flex flex-col items-center md:relative mb-8 py-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 order-2 md:order-1">Gerenciar Abrigos</h1>
                    <div className="w-full md:absolute md:top-1/2 md:-translate-y-1/2 md:left-0 flex justify-center md:justify-start mt-4 md:mt-0 order-1 md:order-2">
                        {/* Link para voltar para página de perfil */}
                        <Link href={"/perfil"} className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm font-medium">
                            <i className="fas fa-arrow-left size-4"></i>
                            <span>Voltar para Perfil</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Caixa do select para selecionar uma cidade desejada */}
                        <div className="p-4 bg-white rounded-lg shadow">
                            <label htmlFor="cidade-select-filter" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Filtrar Abrigos por Cidade:
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

                        {/* Componente que exibe a lista de abrigos */}
                        <ListaAbrigosCadastrados abrigos={abrigos} isDeletingAbrigo={deletingAbrigoId} onExcluirAbrigo={promptExcluirAbrigo} isLoadingAbrigos={isLoadingAbrigos} selectedCidadeId={selectedCidadeIdParaFiltro} />
                    </div>

                    {/* Componente de formulário para registro de abrigos */}
                    <RegistrarAbrigoForm onFormSubmit={handleRegistrarAbrigo} isSubmitting={isSubmitting} todasCidades={todasCidades} />
                </div>
            </div>
        </main>
    );
}
