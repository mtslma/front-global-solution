"use client";

import React, { useState, useEffect, useCallback } from "react";
import Mapa from "../../components/Mapa/Mapa";
import { Ocorrencia, Cidade, Abrigo, sessaoBody } from "@/types/types";
import { API_BASE, API_KEY } from "@/services/api-config";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { Routing } from "leaflet";
import DetalhesCidadeSelecionada from "@/components/DetalhesCidadeSelecionada/DetalhesCidadeSelecionadad";
import DetalhesRotaTracada from "@/components/DetalhesRotaTracada/DetalhesRotaTracada";
import SelectorCidade from "@/components/SelecionarCidade/SelecionarCidade";

export default function Explorar() {
    // Estados para dados da aplicação: cidades, seleção atual, abrigos, ocorrências e instruções de rota.
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null);
    const [abrigosAtuais, setAbrigosAtuais] = useState<Abrigo[]>([]);
    const [ocorrenciasAtuais, setOcorrenciasAtuais] = useState<Ocorrencia[]>([]);
    const [rotaInstrucoes, setRotaInstrucoes] = useState<Routing.IInstruction[] | null>(null);

    // Estados para controle de carregamento e erro da página/dados iniciais.
    const [isLoading, setIsLoading] = useState(true); // Loading geral da página
    const [error, setError] = useState<string | null>(null); // Erro geral da página

    // Estados de loading/erro específicos para Ocorrências.
    const [isLoadingOcorrencias, setIsLoadingOcorrencias] = useState(false);
    const [errorOcorrencias, setErrorOcorrencias] = useState<string | null>(null);

    // Estados de loading/erro específicos para Abrigos.
    const [isLoadingAbrigos, setIsLoadingAbrigos] = useState(false);
    const [errorAbrigos, setErrorAbrigos] = useState<string | null>(null);

    // Função para buscar dados de uma sessão existente usando um token.
    // Retorna dados da sessão ou null se inválida/erro.
    const buscarSessao = useCallback(async (token: string): Promise<sessaoBody | null> => {
        try {
            const response = await fetch(`${API_BASE}/sessao/${token}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            });
            if (!response.ok) {
                // Sessão inválida, remove token e não prossegue.
                localStorage.removeItem("session-token");
                console.warn("Sessão existente inválida (detectado em Explorar), token removido.");
                return null;
            }
            const sessaoData: sessaoBody = await response.json();
            if (!sessaoData || !sessaoData.responseUsuarioDto) {
                // Dados da sessão inconsistentes.
                console.warn("Dados da sessão inválidos ou usuário não encontrado (detectado em Explorar).");
                localStorage.removeItem("session-token");
                return null;
            }
            return sessaoData;
        } catch (err) {
            console.error("Erro de conexão ao buscar sessão (em Explorar):", err);
            localStorage.removeItem("session-token"); // Remove token em caso de erro de rede.
            return null;
        }
    }, []);

    // Busca abrigos da API para a cidade especificada por ID.
    const buscarAbrigosPorCidade = useCallback(async (idDaCidade: string | number) => {
        setIsLoadingAbrigos(true);
        setErrorAbrigos(null);
        setAbrigosAtuais([]); // Limpa abrigos anteriores antes de nova busca.
        try {
            const response = await fetch(`${API_BASE}/abrigo/cidade/${idDaCidade}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || `Erro ao buscar abrigos para a cidade ID ${idDaCidade}.`);
            }
            const responseBody = await response.json();
            setAbrigosAtuais(responseBody.data || []); // Define abrigos ou array vazio se não houver dados.
        } catch (err) {
            console.error(`Erro ao buscar abrigos para cidade ID ${idDaCidade}:`, err);
            const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setErrorAbrigos(message); // Define erro específico para abrigos.
        } finally {
            setIsLoadingAbrigos(false);
        }
    }, []);

    // Busca ocorrências da API para a cidade especificada por ID.
    const buscarOcorrenciasPorCidade = useCallback(async (idDaCidade: string | number) => {
        setIsLoadingOcorrencias(true);
        setErrorOcorrencias(null);
        setOcorrenciasAtuais([]); // Limpa ocorrências anteriores.
        try {
            const response = await fetch(`${API_BASE}/ocorrencia/cidade/${idDaCidade}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || `Erro ao buscar ocorrências para a cidade ID ${idDaCidade}.`);
            }
            const responseBody = await response.json();
            setOcorrenciasAtuais(responseBody.data || []); // Define ocorrências ou array vazio.
        } catch (err) {
            console.error(`Erro ao buscar ocorrências para cidade ID ${idDaCidade}:`, err);
            const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setErrorOcorrencias(message); // Define erro específico para ocorrências.
        } finally {
            setIsLoadingOcorrencias(false);
        }
    }, []);

    // Efeito para carregar dados iniciais: lista de cidades e, se possível,
    // a cidade salva na sessão do usuário ou a primeira cidade da lista como fallback.
    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setIsLoading(true); // Loading geral da página.
            setError(null); // Limpa erro geral anterior.
            try {
                // 1. Busca todas as cidades ativas.
                const responseCidades = await fetch(`${API_BASE}/cidade/search`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
                });
                if (!responseCidades.ok) throw new Error((await responseCidades.text()) || "Erro ao buscar cidades.");

                const responseBodyCidades = await responseCidades.json();
                const fetchedCidadesApi: Cidade[] = responseBodyCidades.data || [];
                const cidadesAtivas = fetchedCidadesApi.filter((c) => !c.deleted);
                setCidades(cidadesAtivas);

                let cidadeParaCarregar: Cidade | null = null;
                const token = localStorage.getItem("session-token");

                // 2. Tenta carregar a cidade da sessão do usuário.
                if (token) {
                    const sessao = await buscarSessao(token); // `buscarSessao` já lida com token inválido.
                    if (sessao?.statusSessao?.toUpperCase() === "ATIVA" && sessao.responseUsuarioDto?.idCidade) {
                        const idCidadeUsuario = sessao.responseUsuarioDto.idCidade;
                        cidadeParaCarregar = cidadesAtivas.find((c) => String(c.idCidade) === String(idCidadeUsuario)) || null;
                    }
                }

                // 3. Se não carregou da sessão, usa a primeira cidade da lista como fallback.
                if (!cidadeParaCarregar && cidadesAtivas.length > 0) {
                    cidadeParaCarregar = cidadesAtivas[0];
                }

                // 4. Se uma cidade foi definida para carregar, busca seus dados.
                if (cidadeParaCarregar) {
                    setCidadeSelecionada(cidadeParaCarregar);
                    if (cidadeParaCarregar.idCidade) {
                        // Garante que há um ID.
                        await buscarOcorrenciasPorCidade(cidadeParaCarregar.idCidade);
                        await buscarAbrigosPorCidade(cidadeParaCarregar.idCidade);
                    }
                } else {
                    // Se nenhuma cidade foi carregada (nem da sessão, nem fallback).
                    setOcorrenciasAtuais([]);
                    setAbrigosAtuais([]);
                }
            } catch (err) {
                // Erro crítico durante o carregamento inicial.
                console.error("Erro crítico durante o carregamento inicial da página Explorar:", err);
                setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar dados da página.");
                setCidades([]);
                setCidadeSelecionada(null);
                setOcorrenciasAtuais([]);
                setAbrigosAtuais([]); // Limpa estados.
            } finally {
                setIsLoading(false); // Finaliza loading geral.
            }
        };

        carregarDadosIniciais();
    }, [buscarOcorrenciasPorCidade, buscarAbrigosPorCidade, buscarSessao]); // Dependências estáveis.

    // Manipula a mudança de cidade no seletor.
    // Busca novos dados de abrigos e ocorrências para a cidade recém-selecionada.
    const handleCidadeSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        setRotaInstrucoes(null); // Limpa instruções de rota ao trocar de cidade.

        // Reseta erros e dados de abrigos/ocorrências da cidade anterior.
        setErrorOcorrencias(null);
        setErrorAbrigos(null);
        setOcorrenciasAtuais([]);
        setAbrigosAtuais([]);

        if (selectedId) {
            const cidadeEncontrada = cidades.find((c) => String(c.idCidade) === selectedId);
            if (cidadeEncontrada) {
                setCidadeSelecionada(cidadeEncontrada);
                if (cidadeEncontrada.idCidade) {
                    // Garante que há um ID.
                    // Inicia o carregamento dos dados da nova cidade.
                    await buscarOcorrenciasPorCidade(cidadeEncontrada.idCidade);
                    await buscarAbrigosPorCidade(cidadeEncontrada.idCidade);
                }
            }
        } else {
            // "Selecione uma cidade" ou valor vazio.
            setCidadeSelecionada(null);
            // Dados de ocorrências e abrigos já foram limpos acima.
        }
    };

    // Renderização condicional para estados de carregamento ou erro da página.
    if (isLoading) return <LoadingPage />; // Loading geral da página.
    if (error) return <ErrorPage error={error} />; // Erro crítico na carga inicial.

    // Prepara dados para o componente Mapa com base na cidade selecionada ou fallback.
    const currentLat = cidadeSelecionada?.lat;
    const currentLon = cidadeSelecionada?.lon;
    const mapCoordX = typeof currentLat === "number" ? currentLat : -14.235; // Fallback: centro do Brasil.
    const mapCoordY = typeof currentLon === "number" ? currentLon : -51.9253; // Fallback: centro do Brasil.
    const mapNomeCentro = cidadeSelecionada?.nomeCidade || "Brasil";
    const mapZoom = cidadeSelecionada ? cidadeSelecionada.zoomPadrao || 13 : 4; // Zoom ajustado.
    const mapOcorrencias = ocorrenciasAtuais;
    const mapAbrigos = abrigosAtuais;

    // Controle de loading/erro para dados específicos do mapa (ocorrências e abrigos).
    const isLoadingMapData = isLoadingOcorrencias || isLoadingAbrigos;
    const mapDataError = errorOcorrencias || errorAbrigos;

    return (
        <main className="h-full md:min-w-screen md:h-screen bg-slate-100 p-4 md:p-6 lg:p-10 flex flex-col overflow-hidden">
            {/* Contêiner principal para mapa e sidebar. */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-screen-2xl w-full mx-auto flex-grow overflow-hidden">
                {/* Seção do Mapa com altura ajustada. */}
                <section className="w-full lg:order-1 lg:flex-grow h-[30vh] sm:h-[35vh] lg:h-[75vh] min-h-[250px] sm:min-h-[300px] border-2 rounded-xl border-indigo-300 shadow-xl bg-white overflow-hidden flex items-center justify-center relative">
                    {/* Overlay de Loading para dados do mapa (ocorrências/abrigos). */}
                    {isLoadingMapData && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                            <LoadingPage /> {/* Componente de loading menor ou spinner pode ser usado aqui. */}
                        </div>
                    )}
                    {/* Overlay de Erro para dados do mapa. */}
                    {mapDataError && !isLoadingMapData && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 p-4">
                            <p className="text-red-600 text-center">
                                Erro ao carregar dados para {cidadeSelecionada?.nomeCidade || "a cidade selecionada"}: {mapDataError}
                            </p>
                        </div>
                    )}
                    {/* Componente Mapa. */}
                    <Mapa coordX={mapCoordX} coordY={mapCoordY} nomeCentro={mapNomeCentro} zoom={mapZoom} ocorrencias={mapOcorrencias} abrigos={mapAbrigos} onRouteInstructionsUpdate={setRotaInstrucoes} />
                    {/* Mensagem para selecionar cidade se nenhuma estiver carregada e não houver erro/loading. */}
                    {!cidadeSelecionada && !isLoadingMapData && !mapDataError && (
                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 p-4 pointer-events-none">
                            <p className="text-gray-600 text-center text-lg">Selecione uma cidade para visualizar o mapa e seus dados.</p>
                        </div>
                    )}
                </section>

                {/* Sidebar para seleção de cidade e exibição de detalhes/rota. */}
                <aside className={`w-full lg:order-2 lg:h-[75vh] lg:w-[450px] lg:flex-shrink-0 bg-white p-5 sm:p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden`}>
                    {/* Título da Sidebar */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 flex-shrink-0">Cidades registradas</h2>

                    {/* Componente para selecionar a cidade. */}
                    <SelectorCidade
                        cidades={cidades}
                        cidadeSelecionada={cidadeSelecionada}
                        handleCidadeSelectChange={handleCidadeSelectChange}
                        isLoading={isLoading} // Usa loading específico das cidades.
                    />

                    {/* Exibe detalhes da cidade ou da rota, dependendo do estado. */}
                    <DetalhesCidadeSelecionada cidadeSelecionada={cidadeSelecionada} rotaInstrucoes={rotaInstrucoes} ocorrenciasAtuais={ocorrenciasAtuais} abrigosAtuais={abrigosAtuais} />

                    <DetalhesRotaTracada rotaInstrucoes={rotaInstrucoes} />

                    {/* Mensagem instrucional fixa no final da Sidebar. */}
                    <div className="mt-auto pt-3 border-t border-gray-200 text-center text-gray-500 text-xs p-2 bg-gray-50 rounded-md flex-shrink-0">
                        Clique em um marcador de abrigo{" "}
                        <span role="img" aria-label="abrigo">
                            🏠
                        </span>{" "}
                        no mapa para traçar uma rota.
                    </div>
                </aside>
            </div>
        </main>
    );
}
