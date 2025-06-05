"use client";

import { API_BASE, API_KEY } from "@/services/api-config";
import { loginBody, sessaoBody, Cidade, CreateUsuario } from "@/types/types";
import { useEffect, useState, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import LoginForm from "@/components/Formularios/LoginForm/LoginForm";
import RegistroForm, { RegistroFormData } from "@/components/Formularios/RegistrarUsuarioForm/RegistrarUsuarioForm";

export default function LoginPage() {
    // Estado para controlar o status de submissão dos formulários (login/registro)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // Estado para alternar entre o formulário de login e o de registro
    const [isRegistro, setIsRegistro] = useState<boolean>(false);
    // Estado para armazenar a lista de cidades (usado no formulário de registro)
    const [listaCidades, setListaCidades] = useState<Cidade[]>([]);

    // Estados para controlar a exibição do popup de alerta/notificação
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Função para exibir um popup de notificação
    const showPopup = (message: string, type: "success" | "error" | "info", duration = 4000) => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        // Esconde o popup automaticamente após a duração especificada
        setTimeout(() => setIsPopupVisible(false), duration);
    };

    // Função para buscar dados de uma sessão existente usando um token
    const buscarSessao = useCallback(async (token: string): Promise<sessaoBody | null> => {
        try {
            const response = await fetch(`${API_BASE}/sessao/${token}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            });
            if (!response.ok) {
                // Se a sessão não for válida, remove o token do localStorage
                localStorage.removeItem("session-token");
                console.warn("Sessão existente inválida, token removido.");
                return null;
            }
            const sessaoData: sessaoBody = await response.json();
            // Validação adicional para os dados da sessão
            if (!sessaoData || !sessaoData.responseUsuarioDto) {
                throw new Error("Dados da sessão inválidos ou usuário não encontrado.");
            }
            return sessaoData;
        } catch (err) {
            console.error("Erro de conexão ao buscar sessão:", err);
            return null;
        }
    }, []); 

    // Função para buscar todas as cidades ativas para o formulário de registro
    const fetchAllCidades = useCallback(async (): Promise<Cidade[]> => {
        try {
            const response = await fetch(`${API_BASE}/cidade/search`, {
                method: "GET",
                headers: { "x-api-key": API_KEY },
            });
            if (!response.ok) throw new Error("Falha ao buscar lista de cidades para registro.");
            const responseJSON = await response.json();
            if (responseJSON && Array.isArray(responseJSON.data)) {
                // Filtra para retornar apenas cidades não deletadas
                return responseJSON.data.filter((cidade: Cidade) => !cidade.deleted);
            }
            return [];
        } catch (errCatch) {
            console.error("Erro ao buscar lista de cidades:", errCatch);
            const errorMessage = errCatch instanceof Error ? errCatch.message : "Erro desconhecido";
            showPopup(`Erro ao carregar cidades: ${errorMessage}`, "error");
            return [];
        }
    }, []);

    // useEffect para verificar se existe uma sessão ativa ao carregar a página
    useEffect(() => {
        async function verificarSessaoERedirecionar() {
            const token = localStorage.getItem("session-token");
            if (token) {
                const sessao = await buscarSessao(token);
                // Se a sessão estiver ativa, redireciona o usuário para a página de perfil
                if (sessao?.statusSessao?.toUpperCase() === "ATIVA") {
                    window.location.href = "/perfil";
                }
            }
        }
        verificarSessaoERedirecionar();
    }, [buscarSessao]); 

    // useEffect para carregar a lista de cidades quando o formulário de registro é ativado
    useEffect(() => {
        // Só busca as cidades se estiver na tela de registro e a lista ainda não foi carregada
        if (isRegistro && listaCidades.length === 0) {
            fetchAllCidades().then(setListaCidades);
        }
    }, [isRegistro, fetchAllCidades, listaCidades.length]); // Executa quando isRegistro, fetchAllCidades ou o tamanho da listaCidades muda

    // Função de callback para o submit do formulário de login
    const onLoginSubmit: SubmitHandler<loginBody> = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE}/autenticacao`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorMessageApi = await response.text();
                // Mostra mensagem de erro da API ou uma mensagem genérica
                showPopup(errorMessageApi || "Credenciais inválidas ou erro no login.", "error");
                return;
            }
            const responseData: { "session-token": string } = await response.json();
            if (responseData["session-token"]) {
                // Armazena o token da sessão no localStorage e redireciona para o perfil
                localStorage.setItem("session-token", responseData["session-token"]);
                window.location.href = "/perfil";
            } else {
                showPopup("Token de sessão não recebido após o login.", "error");
            }
        } catch (errCatch) {
            console.error("Erro de conexão durante o login:", errCatch);
            const errorMessage = errCatch instanceof Error ? `Erro de conexão: ${errCatch.message}` : "Erro de conexão. Tente novamente.";
            showPopup(errorMessage, "error");
        } finally {
            setIsSubmitting(false); // Garante que o estado de submissão seja resetado
        }
    };

    const { reset: resetRegistroFormHook } = useForm<RegistroFormData>();
    // Função de callback para o submit do formulário de registro
    const onRegistroSubmit: SubmitHandler<RegistroFormData> = async (data) => {
        setIsSubmitting(true);
        // Mapeia os dados do formulário para o formato esperado pela API (CreateUsuario)
        const corpoRegistro: CreateUsuario = {
            nomeUsuario: data.nomeUsuario,
            tipoUsuario: "CLIENTE", // Define o tipo de usuário como CLIENTE por padrão. Mudar isso aqui pra API definir o tipo invés do front
            autenticaUsuario: {
                emailUsuario: data.emailUsuario,
                senhaUsuario: data.senhaUsuario,
            },
            telefoneContato: data.telefoneContato,
            idCidade: data.idCidade,
        };
        try {
            const response = await fetch(`${API_BASE}/usuario`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                body: JSON.stringify(corpoRegistro),
            });
            // Verifica se a criação não foi bem-sucedida (status diferente de 201 ou !response.ok)
            if (response.status !== 201 && !response.ok) {
                const errorMessageApi = await response.text();
                showPopup(errorMessageApi || "Erro ao criar conta. Verifique os dados e tente novamente.", "error");
                return;
            }
            // Sucesso no registro
            showPopup(await response.text(), "success");
            setIsRegistro(false); // Volta para a tela de login
            resetRegistroFormHook(); // Limpa os campos do formulário de registro
        } catch (errCatch) {
            console.error("Erro de conexão durante o registro:", errCatch);
            const errorMessage = errCatch instanceof Error ? `Erro de conexão: ${errCatch.message}` : "Erro de conexão com o servidor.";
            showPopup(errorMessage, "error");
        } finally {
            setIsSubmitting(false); // Garante que o estado de submissão seja resetado
        }
    };

    // Definições de classes CSS para estilização dos inputs e botões (Tailwind CSS)
    const inputBaseClasses = "mt-1 w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 text-sm md:text-base transition-colors";
    const inputErrorClasses = "border-red-400 focus:ring-red-500"; // Estilo para input com erro
    const inputValidClasses = "border-gray-300 focus:ring-indigo-500"; // Estilo para input válido/padrão
    const errorTextClasses = "text-red-500 text-xs sm:text-sm mt-1"; // Estilo para mensagens de erro dos campos
    const buttonClasses = "w-full py-2 md:py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-gray-800 font-sans p-4">
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            <div className="w-full max-w-sm p-6 md:max-w-md md:p-8 bg-white rounded-xl shadow-2xl">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-6 md:mb-8">
                    {/* Título dinâmico baseado se é tela de login ou registro */}
                    {isRegistro ? "Criar Conta Ponto Seguro" : "Login Ponto Seguro"}
                </h1>

                {/* Renderização condicional do formulário de Registro ou Login */}
                {isRegistro ? (
                    <RegistroForm onSubmit={onRegistroSubmit} isSubmitting={isSubmitting} listaCidades={listaCidades} inputBaseClasses={inputBaseClasses} inputErrorClasses={inputErrorClasses} inputValidClasses={inputValidClasses} errorTextClasses={errorTextClasses} buttonClasses={buttonClasses} formSpacingClasses="space-y-3 md:space-y-4" />
                ) : (
                    <LoginForm onSubmit={onLoginSubmit} isSubmitting={isSubmitting} inputBaseClasses={inputBaseClasses} inputErrorClasses={inputErrorClasses} inputValidClasses={inputValidClasses} errorTextClasses={errorTextClasses} buttonClasses={buttonClasses} formSpacingClasses="space-y-5 md:space-y-6" />
                )}

                <div className="mt-4 md:mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegistro(!isRegistro); // Alterna entre modo registro e login
                            setPopupMessage(""); // Limpa mensagens de popup anteriores
                            setIsPopupVisible(false); // Esconde o popup
                            if (isRegistro) {
                                resetRegistroFormHook();
                            }
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none"
                    >
                        {/* Texto do botão de alternância muda conforme o estado */}
                        {isRegistro ? "Já tem uma conta? Faça login" : "Não tem uma conta? Registre-se"}
                    </button>
                </div>
            </div>
        </div>
    );
}
