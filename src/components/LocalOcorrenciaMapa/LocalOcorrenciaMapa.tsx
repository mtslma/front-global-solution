// components/LocalOcorrenciaMapa/LocalOcorrenciaMapa.tsx
"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression, DivIcon, PathOptions } from "leaflet"; // Importar L
import "leaflet/dist/leaflet.css";
import { Ocorrencia } from "@/types/types";

// Configuração para corrigir o ícone padrão do Leaflet - Executar apenas no cliente
if (typeof window !== "undefined") {
    const defaultIconPrototype = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void };
    delete defaultIconPrototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
    });
}

const criarIconeAlertaMapa = (tipoOcorrencia?: string): DivIcon => {
    let htmlContent = "",
        corIconeNoMapa = "";
    switch (tipoOcorrencia?.toUpperCase()) {
        case "DESLIZAMENTO":
            htmlContent = "⛰️";
            corIconeNoMapa = "saddlebrown";
            break;
        case "ENCHENTE":
        case "ALAGAMENTO":
            htmlContent = "🌊";
            corIconeNoMapa = "dodgerblue";
            break;
        case "QUEIMADA":
        case "INCENDIO":
            htmlContent = "🔥";
            corIconeNoMapa = "darkorange";
            break;
        default:
            htmlContent = "❓";
            corIconeNoMapa = "dimgray";
    }
    return new L.DivIcon({
        html: `<div style="font-size: 24px; color: ${corIconeNoMapa}; text-shadow: 0 0 2px white, 0 0 1px white;">${htmlContent}</div>`,
        className: "custom-leaflet-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    });
};

interface EstiloCirculo {
    radius: number;
    pathOptions: PathOptions;
}
const getEstiloCirculoSeveridade = (nivelGravidade?: string): EstiloCirculo => {
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

function MapViewController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface LocalOcorrenciaMapaProps {
    ocorrencia: Ocorrencia;
}

const LocalOcorrenciaMapa: React.FC<LocalOcorrenciaMapaProps> = ({ ocorrencia }) => {
    if (typeof window === "undefined" || !ocorrencia) return null;

    const { lat, lon, tipoOcorrencia, nivelGravidade } = ocorrencia;

    if (isNaN(lat) || isNaN(lon)) {
        return <div className="flex justify-center items-center h-full bg-red-50 text-red-600 p-4 rounded-lg">Coordenadas inválidas.</div>;
    }

    const position: LatLngExpression = [lat, lon];
    const icon = criarIconeAlertaMapa(tipoOcorrencia);
    const circleStyle = getEstiloCirculoSeveridade(nivelGravidade);
    const mapZoom = 15;

    return (
        <MapContainer center={position} zoom={mapZoom} style={{ height: "100%", width: "100%" }} className="rounded-lg shadow-md" preferCanvas={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <MapViewController center={position} zoom={mapZoom} />
            <Marker position={position} icon={icon}>
                <Popup minWidth={180}>
                    <div className="text-sm font-medium">
                        <strong className="block text-base mb-1">{ocorrencia.tipoOcorrencia.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</strong>
                        Nível: {ocorrencia.nivelGravidade}
                        <br />
                        <span className="text-xs">
                            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
                        </span>
                    </div>
                </Popup>
            </Marker>
            <Circle center={position} radius={circleStyle.radius} pathOptions={circleStyle.pathOptions} />
        </MapContainer>
    );
};

export default LocalOcorrenciaMapa;
