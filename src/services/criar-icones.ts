import L, { DivIcon } from 'leaflet';
import { Ocorrencia } from '@/types/types';



// Cria um ícone customizado (L.DivIcon) para marcadores de alerta de ocorrências.
export const criarIconeAlerta = (tipo: Ocorrencia["tipoOcorrencia"]): DivIcon => {
    let htmlContent = "", cor = "";
    switch (tipo.toUpperCase()) {
        case "DESLIZAMENTO":
            htmlContent = "⛰️"; cor = "orange"; break;
        case "ENCHENTE": case "ALAGAMENTO":
            htmlContent = "🌊"; cor = "blue"; break;
        case "QUEIMADA": case "INCENDIO":
            htmlContent = "🔥"; cor = "red"; break;
        default:
            htmlContent = "❓"; cor = "gray";
    }
    return new L.DivIcon({
        html: `<div style="font-size: 24px; color: ${cor}; text-shadow: 0 0 3px white, 0 0 1px white, 0 0 1px white;">${htmlContent}</div>`,
        className: "custom-leaflet-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    });
};

// Cria um ícone customizado (L.DivIcon) para marcadores de abrigos.
export const criarIconeAbrigo = (): DivIcon => { 
    return new L.DivIcon({
        html: `<div style="font-size: 24px; color: green; text-shadow: 0 0 3px white, 0 0 1px white, 0 0 1px white;">🏠</div>`,
        className: "custom-leaflet-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    });
};

