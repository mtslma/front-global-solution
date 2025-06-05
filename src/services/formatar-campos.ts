import { CircleStyle, EstiloCirculo, Ocorrencia } from "@/types/types";

export const formatarCepDisplay = (cep: string | undefined): string => {
    if (!cep) {
        return ""; // Retorna vazio se o CEP for nulo/indefinido; o JSX tratará o fallback.
    }
    const cleaned = cep.replace(/\D/g, ""); // Remove caracteres não numéricos.
    if (cleaned.length === 8) {
        return `${cleaned.substring(0, 5)}-${cleaned.substring(5, 8)}`;
    }
    return cep; // Retorna o CEP original se não puder ser formatado.
};

export const formatarTelefoneDisplay = (numero: string | undefined): string => {
    if (!numero) {
        return ""; // Será tratado pelo fallback `|| "Não informado"` no JSX
    }
    // Remove todos os caracteres não numéricos do número.
    const cleaned = numero.replace(/\D/g, "");
    const length = cleaned.length;

    if (length === 11) {
        // Formato para números com 11 dígitos: (XX) XXXXX-XXXX (celular com 9º dígito)
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
    }
    if (length === 10) {
        // Formato para números com 10 dígitos: (XX) XXXX-XXXX (fixo ou celular antigo)
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
    }

    // Se não for um número de 10 ou 11 dígitos (após limpeza), retorna o número original.
    return numero;
};

export const getNivelGravidadeClasses = (nivel: string | undefined): string => {
    switch (nivel?.toUpperCase()) {
        case "ALTO":
            return "bg-red-100 text-red-800 border border-red-200";
        case "MÉDIO":
            return "bg-amber-100 text-amber-800 border border-amber-200";
        case "BAIXO":
            return "bg-green-100 text-green-800 border border-green-200";
        default:
            return "bg-gray-100 text-gray-800 border border-gray-200";
    }
};

export const getStatusFuncionamentoClasses = (status: string | undefined): string => {
    switch (status?.toUpperCase()) {
        case "NORMAL":
            return "bg-green-100 text-green-800 border border-green-200";
        case "PARCIAL":
            return "bg-amber-100 text-amber-800 border border-amber-200";
        case "INTERDITADO":
            return "bg-red-100 text-red-800 border border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border border-gray-200";
    }
};

export const getVisualizacaoTipoOcorrencia = (tipo?: string): { iconeClasseFA: string; corClasseIcone: string } => {
    const tipoUpper = tipo?.toUpperCase();
    switch (tipoUpper) {
        case "DESLIZAMENTO":
            return { iconeClasseFA: "fa-solid fa-hill-rockslide", corClasseIcone: "text-yellow-700" };
        case "ENCHENTE":
            return { iconeClasseFA: "fa-solid fa-house-flood-water", corClasseIcone: "text-blue-600" };
        case "ALAGAMENTO":
            return { iconeClasseFA: "fa-solid fa-water", corClasseIcone: "text-sky-600" };
        case "QUEIMADA":
        case "INCENDIO":
            return { iconeClasseFA: "fa-solid fa-fire-flame-curved", corClasseIcone: "text-amber-600" };
        default:
            return { iconeClasseFA: "fa-solid fa-circle-question", corClasseIcone: "text-gray-500" };
    }
};

export const getDetalhesSeveridade = (nivel?: string): { textoCor: string; bgCor: string; bordaCor: string; iconeFA: string; etiqueta: string } => {
    const nivelUpper = nivel?.toUpperCase();
    switch (nivelUpper) {
        case "BAIXO":
            return { textoCor: "text-yellow-600", bgCor: "bg-yellow-100", bordaCor: "border-yellow-500", iconeFA: "fa-shield-halved", etiqueta: "Baixo" };
        case "MÉDIO":
            return { textoCor: "text-orange-600", bgCor: "bg-orange-100", bordaCor: "border-orange-500", iconeFA: "fa-triangle-exclamation", etiqueta: "Médio" };
        case "ALTO":
            return { textoCor: "text-red-600", bgCor: "bg-red-100", bordaCor: "border-red-500", iconeFA: "fa-triangle-exclamation", etiqueta: "Alto" };
        default:
            return { textoCor: "text-gray-600", bgCor: "bg-gray-100", bordaCor: "border-gray-400", iconeFA: "fa-circle-info", etiqueta: nivel || "Indefinido" };
    }
};


export default function getCircleOptions (ocorrencia: Ocorrencia): CircleStyle {
    let radius: number, strokeColor: string, fillColor: string;
    switch (ocorrencia.nivelGravidade.toUpperCase()) {
        case "BAIXO":
            radius = 75;
            strokeColor = "#facc15";
            fillColor = "#fde047";
            break;
        case "MÉDIO":
        case "MODERADO":
            radius = 100;
            strokeColor = "#f59e0b";
            fillColor = "#fbbf24";
            break;
        case "ALTO":
        case "CRÍTICO":
            radius = 150;
            strokeColor = "#ef4444";
            fillColor = "#f87171";
            break;
        default:
            radius = 50;
            strokeColor = "grey";
            fillColor = "lightgrey";
    }
    return { radius, pathOptions: { color: strokeColor, fillColor: fillColor, fillOpacity: 0.35, weight: 2 } };
};

export const getEstiloCirculoSeveridade = (nivelGravidade?: string): EstiloCirculo => {
    let radius: number, strokeColor: string, fillColor: string;
    switch (nivelGravidade?.toUpperCase()) {
        case "BAIXO":
            radius = 75;
            strokeColor = "#facc15";
            fillColor = "#fde047";
            break;
        case "MÉDIO":
        case "MODERADO":
            radius = 100;
            strokeColor = "#f59e0b";
            fillColor = "#fbbf24";
            break;
        case "ALTO":
        case "CRÍTICO":
            radius = 150;
            strokeColor = "#ef4444";
            fillColor = "#f87171";
            break;
        default:
            radius = 50;
            strokeColor = "grey";
            fillColor = "lightgrey";
    }
    return { radius, pathOptions: { color: strokeColor, fillColor: fillColor, fillOpacity: 0.4, weight: 2 } };
};
