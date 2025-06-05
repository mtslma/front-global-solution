"use client";

import React, { useState, useEffect, useCallback } from "react";
import ActionLink from "@/components/LinkColaborador/LinkColaborador";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import { API_BASE, API_KEY } from "@/services/api-config";
import { usuarioBody, sessaoBody, Cidade, EmailFormData, SenhaFormData, TelefoneFormData } from "@/types/types";
import { SubmitHandler } from "react-hook-form";
import EditarEmailForm from "@/components/Formularios/EditarEmailForm/EditarEmailForm";
import EditarSenhaForm from "@/components/Formularios/EditarSenhaForm/EditarSenhaForm";
import EditarTelefoneForm from "@/components/Formularios/EditarTelefoneForm/EditarTelefoneForm";
import { formatarCepDisplay, formatarTelefoneDisplay } from "@/services/formatar-campos";

export default function Perfil() {
    // Estados para dados do usuário, cidade, UI e controle de edição/submissão.
    const [usuarioInfo, setUsuarioInfo] = useState<usuarioBody | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cidadeAtual, setCidadeAtual] = useState<Cidade | null>(null);
    const [listaCidades, setListaCidades] = useState<Cidade[]>([]);
    const [cidadeSelecionadaId, setCidadeSelecionadaId] = useState<string>("");
    const [atualizandoCidade, setAtualizandoCidade] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [campoEmEdicao, setCampoEmEdicao] = useState<"email" | "senha" | "telefone" | null>(null);
    const [atualizandoEmail, setAtualizandoEmail] = useState(false);
    const [atualizandoSenha, setAtualizandoSenha] = useState(false);
    const [atualizandoTelefone, setAtualizandoTelefone] = useState(false);

    // Exibe popups de notificação (sucesso, erro, info).
    const showPopup = useCallback((message: string, type: "success" | "error" | "info", duration = 4000) => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), duration);
    }, []);

    // Valida a sessão do usuário e busca os dados associados. Redireciona para /login em caso de falha.
    const buscarSessao = useCallback(async (token: string): Promise<sessaoBody | null> => {
        try {
            const response = await fetch(`${API_BASE}/sessao/${token}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            });
            if (!response.ok) {
                // Sessão inválida ou expirada.
                localStorage.removeItem("session-token");
                window.location.href = "/login";
                return null;
            }
            const sessaoData: sessaoBody = await response.json();
            if (!sessaoData?.responseUsuarioDto) throw new Error("Dados do usuário não encontrados na sessão.");
            return sessaoData;
        } catch (err) {
            console.error("Erro ao buscar sessão:", err);
            localStorage.removeItem("session-token"); // Garante limpeza do token local.
            window.location.href = "/login"; // Redireciona em caso de erro crítico.
            return null;
        }
    }, []);

    // Busca a lista completa de cidades ativas para o dropdown de seleção.
    const fetchAllCidades = useCallback(async (): Promise<Cidade[]> => {
        try {
            const response = await fetch(`${API_BASE}/cidade/search`, {
                method: "GET",
                headers: { "x-api-key": API_KEY },
            });
            if (!response.ok) throw new Error("Falha ao buscar lista de cidades");
            const responseJSON = await response.json();
            return responseJSON?.data?.filter((cidade: Cidade) => !cidade.deleted) || []; // Filtra cidades deletadas.
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao buscar cidades";
            showPopup(`Erro ao carregar lista de cidades: ${message}. A troca pode estar indisponível.`, "error");
            console.error("Erro ao buscar lista de cidades:", err);
            return [];
        }
    }, [showPopup]);

    // Efeito para carregar dados iniciais do perfil na montagem do componente.
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("session-token");
            if (!token) {
                // Se não há token, redireciona para login.
                window.location.href = "/login";
                return;
            }
            try {
                const sessao = await buscarSessao(token);
                if (sessao?.responseUsuarioDto) {
                    setUsuarioInfo(sessao.responseUsuarioDto);
                    if (sessao.responseUsuarioDto.idCidade) {
                        // Pré-seleciona a cidade do usuário.
                        setCidadeSelecionadaId(sessao.responseUsuarioDto.idCidade);
                    }
                }
                const cidades = await fetchAllCidades();
                setListaCidades(cidades);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Ocorreu um erro ao carregar dados do perfil.";
                setError(message); // Define erro geral da página.
            } finally {
                setIsLoading(false);
            }
        };
        carregarDadosIniciais();
    }, [buscarSessao, fetchAllCidades]); // Dependências estáveis devido ao useCallback.

    // Efeito para buscar detalhes da cidade do usuário sempre que o `usuarioInfo.idCidade` mudar.
    useEffect(() => {
        const fetchCidadeDetalhes = async (idCidadeStr: string) => {
            if (!idCidadeStr || isNaN(Number(idCidadeStr))) {
                // Valida o ID da cidade.
                setCidadeAtual(null);
                return;
            }
            try {
                const response = await fetch(`${API_BASE}/cidade/${Number(idCidadeStr)}`, {
                    method: "GET",
                    headers: { "x-api-key": API_KEY },
                });
                if (!response.ok) throw new Error(`Falha ao buscar dados da cidade: ${response.statusText}`);
                const data: Cidade = await response.json();
                setCidadeAtual(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Erro desconhecido";
                showPopup(`Não foi possível carregar dados da cidade atual: ${message}`, "error");
                console.error("Erro ao buscar detalhes da cidade:", err);
                setCidadeAtual(null);
            }
        };

        if (usuarioInfo?.idCidade) {
            fetchCidadeDetalhes(usuarioInfo.idCidade);
        } else {
            setCidadeAtual(null); // Limpa cidade atual se usuário não tiver uma.
        }
    }, [usuarioInfo?.idCidade, showPopup]); // `showPopup` é dependência para o caso de erro.

    // Função genérica para chamadas PUT à API de atualização de dados do usuário.
    const handleAtualizarComumAPI = async (endpoint: string, body: object, setLoadingState: React.Dispatch<React.SetStateAction<boolean>>, successMessage: string, onSuccess?: () => void) => {
        const token = localStorage.getItem("session-token");
        if (!token || !usuarioInfo?.idUsuario) {
            showPopup("Sessão inválida ou informações do usuário ausentes.", "error");
            return;
        }
        setLoadingState(true);
        try {
            const response = await fetch(`${API_BASE}/usuario/${endpoint}/${usuarioInfo.idUsuario}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY, Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                // Trata erros da API.
                const errorText = await response.text(); // TODO: Usar getApiErrorMessage aqui para padronizar.
                throw new Error(errorText || `Falha na operação`);
            }
            showPopup(successMessage, "success");
            if (onSuccess) onSuccess(); // Callback de sucesso opcional.
            setCampoEmEdicao(null); // Fecha o formulário de edição ativo.
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido na operação.";
            showPopup(message, "error");
        } finally {
            setLoadingState(false);
        }
    };

    // Handlers para submissão dos formulários de edição (e-mail, senha, telefone).
    const onSubmitEmail: SubmitHandler<EmailFormData> = (data) => {
        handleAtualizarComumAPI("atualizar-email", { autenticaUsuario: { emailUsuario: data.novoEmail } }, setAtualizandoEmail, "E-mail atualizado!", () => {
            setUsuarioInfo((prev) => (prev ? { ...prev, emailUsuario: data.novoEmail } : null)); // Atualiza UI localmente.
        });
    };
    const onSubmitSenha: SubmitHandler<SenhaFormData> = (data) => {
        handleAtualizarComumAPI("atualizar-senha", { autenticaUsuario: { senhaUsuario: data.novaSenha } }, setAtualizandoSenha, "Senha atualizada!");
    };
    const onSubmitTelefone: SubmitHandler<TelefoneFormData> = (data) => {
        if (data.novoTelefone.replace(/\D/g, "") === usuarioInfo?.telefoneContato?.replace(/\D/g, "")) {
            // Compara apenas dígitos
            showPopup("O novo telefone é igual ao atual.", "info");
            setCampoEmEdicao(null);
            return;
        }
        handleAtualizarComumAPI("atualizar-telefone", { telefoneContato: data.novoTelefone.replace(/\D/g, "") }, setAtualizandoTelefone, "Telefone atualizado!", () => {
            setUsuarioInfo((prev) => (prev ? { ...prev, telefoneContato: data.novoTelefone } : null)); // Atualiza UI localmente.
        });
    };

    // Submete a atualização da cidade de registro do usuário.
    const submitAtualizacaoCidadeAPI = async () => {
        const token = localStorage.getItem("session-token");
        if (!token || !usuarioInfo?.idUsuario || !cidadeSelecionadaId) {
            showPopup("Informações insuficientes para atualizar a cidade.", "error");
            return;
        }
        if (cidadeSelecionadaId === usuarioInfo.idCidade) {
            // Evita chamada desnecessária.
            showPopup("Você já está registrado nesta cidade.", "info");
            return;
        }
        setAtualizandoCidade(true);
        try {
            const response = await fetch(`${API_BASE}/usuario/atualizar-cidade/${usuarioInfo.idUsuario}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY, Authorization: `Bearer ${token}` },
                body: JSON.stringify({ idCidade: Number(cidadeSelecionadaId) }),
            });
            if (!response.ok) {
                const errTxt = await response.text(); // TODO: Usar getApiErrorMessage aqui.
                throw new Error(errTxt || "Falha ao atualizar a cidade.");
            }
            setUsuarioInfo((prev) => (prev ? { ...prev, idCidade: cidadeSelecionadaId } : null)); // Atualiza UI localmente.
            showPopup("Cidade atualizada com sucesso!", "success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro desconhecido ao atualizar cidade.";
            showPopup(`Não foi possível atualizar sua cidade: ${message}`, "error");
        } finally {
            setAtualizandoCidade(false);
        }
    };

    // Handler para o formulário de atualização de cidade.
    const handleCidadeFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        submitAtualizacaoCidadeAPI();
    };

    // Realiza o logout do usuário, invalidando a sessão no backend e limpando localmente.
    function fazerLogout() {
        const token = localStorage.getItem("session-token");
        if (token) {
            fetch(`${API_BASE}/sessao/logout`, {
                // Tenta invalidar token no backend.
                method: "PUT",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify({ tokenSessao: token }),
            })
                .catch((err) => console.error("Falha na chamada de logout da API, prosseguindo com logout local:", err))
                .finally(() => {
                    // Independente do resultado da API, desloga localmente.
                    localStorage.removeItem("session-token");
                    window.location.href = "/login";
                });
        } else {
            // Se não há token, apenas redireciona.
            window.location.href = "/login";
        }
    }

    // Renderizações condicionais para estados de carregamento ou erro.
    if (isLoading) return <LoadingPage />;
    if (error) return <ErrorPage error={error} />;
    if (!usuarioInfo) return <ErrorPage error="Não foi possível carregar as informações do usuário." />;

    // Prepara dados para exibição.
    const dataCriacaoFormatada = usuarioInfo.dataCriacao ? new Date(usuarioInfo.dataCriacao).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }) : "Não disponível";
    const abrirFormEdicao = (campo: "email" | "senha" | "telefone") => setCampoEmEdicao(campo);
    const fecharFormEdicao = () => setCampoEmEdicao(null);
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

    return (
        <main className="min-h-screen bg-slate-100 text-gray-800 font-sans p-4 sm:p-8">
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
            <div className="w-full max-w-7xl mx-auto">
                {/* Cabeçalho da Página */}
                <div className="flex flex-col md:relative mb-2 py-4 px-4 sm:px-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700">Painel do Usuário</h1>
                    <h2 className="text-xl md:text-2xl font-medium text-center text-gray-600 mt-2">
                        Bem-vindo(a), <span className="font-semibold text-indigo-600">{usuarioInfo.nomeUsuario}</span>!
                    </h2>
                    <div className="self-center mt-2 md:absolute md:top-4 md:left-4">
                        <button className="group flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm" onClick={fazerLogout}>
                            <i className="fas fa-arrow-left size-4 group-hover:text-white"></i>
                            <span className="group-hover:underline">Sair da conta</span>
                        </button>
                    </div>
                </div>

                {/* Grid principal para as seções de conteúdo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {" "}
                    {/* items-stretch para igualar altura das caixas */}
                    {/* Seção: Detalhes da Conta */}
                    <section className="p-6 bg-white rounded-xl shadow-xl border border-gray-200 lg:col-span-1 flex flex-col">
                        <h3 className="text-xl font-bold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Detalhes da Sua Conta</h3>
                        <div className="flex-grow">
                            {" "}
                            {/* Permite que o conteúdo interno se expanda */}
                            <div className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                <span className="font-semibold">Nome:</span>
                                <span>{usuarioInfo.nomeUsuario}</span>
                            </div>
                            <div className="py-3 border-b border-gray-200">
                                {" "}
                                {/* E-mail */}
                                <div className="flex justify-between items-center text-gray-700 text-sm sm:text-base">
                                    <div>
                                        <span className="font-semibold">E-mail:</span>
                                        {campoEmEdicao !== "email" && <span className="ml-2 break-all">{usuarioInfo.emailUsuario || "Não informado"}</span>}
                                    </div>
                                    {campoEmEdicao !== "email" && (
                                        <button onClick={() => abrirFormEdicao("email")} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex-shrink-0 ml-2">
                                            Alterar
                                        </button>
                                    )}
                                </div>
                                {campoEmEdicao === "email" && <EditarEmailForm onSubmit={onSubmitEmail} onCancel={fecharFormEdicao} isSubmitting={atualizandoEmail} initialNovoEmail={usuarioInfo.emailUsuario} />}
                            </div>
                            <div className="py-3 border-b border-gray-200">
                                {" "}
                                {/* Telefone */}
                                <div className="flex justify-between items-center text-gray-700 text-sm sm:text-base">
                                    <div>
                                        <span className="font-semibold">Telefone:</span>
                                        {campoEmEdicao !== "telefone" && <span className="ml-2">{formatarTelefoneDisplay(usuarioInfo.telefoneContato) || "Não informado"}</span>}
                                    </div>
                                    {campoEmEdicao !== "telefone" && (
                                        <button onClick={() => abrirFormEdicao("telefone")} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex-shrink-0 ml-2">
                                            Alterar
                                        </button>
                                    )}
                                </div>
                                {campoEmEdicao === "telefone" && <EditarTelefoneForm onSubmit={onSubmitTelefone} onCancel={fecharFormEdicao} isSubmitting={atualizandoTelefone} initialTelefone={usuarioInfo.telefoneContato || ""} />}
                            </div>
                            <div className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                <span className="font-semibold">Tipo de Conta:</span>
                                <span>{usuarioInfo.tipoUsuario === "CLIENTE" ? "Básica" : "Colaborador"}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                <span className="font-semibold">Membro Desde:</span>
                                <span>{dataCriacaoFormatada}</span>
                            </div>
                            <div className="pt-3">
                                {" "}
                                {/* Alterar Senha */}
                                {campoEmEdicao !== "senha" && (
                                    <button onClick={() => abrirFormEdicao("senha")} className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1 text-center">
                                        Alterar senha de acesso
                                    </button>
                                )}
                                {campoEmEdicao === "senha" && <EditarSenhaForm onSubmit={onSubmitSenha} onCancel={fecharFormEdicao} isSubmitting={atualizandoSenha} />}
                            </div>
                        </div>
                    </section>
                    {/* Seção: Sua Cidade */}
                    <section className={`p-6 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col ${usuarioInfo.tipoUsuario === "COLABORADOR" ? "lg:col-span-1" : "lg:col-span-2"}`}>
                        <h3 className="text-xl font-bold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Sua Cidade</h3>
                        <div className="flex-grow space-y-1">
                            {cidadeAtual ? (
                                <>
                                    <p className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                        <strong>Nome:</strong> <span>{cidadeAtual.nomeCidade}</span>
                                    </p>
                                    <p className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                        <strong>CEP:</strong> <span>{formatarCepDisplay(cidadeAtual.cepCidade) || "N/A"}</span>
                                    </p>
                                    <p className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                        <strong>Ocorrências:</strong> <span>{cidadeAtual.quantidadeOcorrencias ?? 0}</span>
                                    </p>
                                    <p className="flex justify-between items-center text-gray-700 text-sm sm:text-base py-3 border-b border-gray-200">
                                        <strong>Abrigos:</strong> <span>{cidadeAtual.quantidadeAbrigos ?? 0}</span>
                                    </p>
                                </>
                            ) : usuarioInfo.idCidade ? (
                                <p className="text-center text-gray-500 py-3">Carregando dados da cidade...</p>
                            ) : null}
                            {!usuarioInfo.idCidade && !cidadeAtual && <p className="text-center text-gray-500 mb-4 py-3">Você ainda não registrou uma cidade.</p>}
                        </div>
                        {/* Formulário para alterar cidade */}
                        <form onSubmit={handleCidadeFormSubmit} className="mt-auto pt-4">
                            <label htmlFor="cidadeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                                Alterar cidade de registro:
                            </label>
                            {listaCidades.length === 0 && !isLoading && !isLoading && <p className="text-sm text-gray-500 mt-1">Nenhuma cidade disponível para seleção.</p>}
                            <select id="cidadeSelect" value={cidadeSelecionadaId} onChange={(e) => setCidadeSelecionadaId(e.target.value)} className={inputClasses} disabled={atualizandoCidade || listaCidades.length === 0 || isLoading}>
                                <option value="" disabled>
                                    {isLoading ? "Carregando cidades..." : listaCidades.length === 0 ? "Nenhuma cidade disponível" : "Selecione uma cidade"}
                                </option>
                                {listaCidades.map((cidade) => (
                                    <option key={cidade.idCidade} value={String(cidade.idCidade)}>
                                        {cidade.nomeCidade}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={atualizandoCidade || !cidadeSelecionadaId || cidadeSelecionadaId === usuarioInfo.idCidade || listaCidades.length === 0}
                                className="mt-4 w-full flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {atualizandoCidade ? "Salvando..." : "Salvar Nova Cidade"}
                            </button>
                        </form>
                    </section>
                    {/* Seção: Área do Colaborador (condicional) */}
                    {usuarioInfo.tipoUsuario === "COLABORADOR" && (
                        <section className="lg:col-span-1 p-6 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col">
                            <h3 className="text-xl font-bold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Área do Colaborador</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-grow">
                                <ActionLink href="/gerenciar-cidades" iconClassName="fa-city" title="Gerenciar Cidades" description="Registre, visualize, atualize ou exclua cidades." />
                                <ActionLink href="/gerenciar-abrigos" iconClassName="fa-person-shelter" title="Gerenciar Abrigos" description="Registre, visualize, atualize ou exclua abrigos." />
                                <ActionLink href="/gerenciar-ocorrencias" iconClassName="fa-house-flood-water" title="Gerenciar Ocorrências" description="Registre, visualize, atualize ou exclua ocorrências." />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
