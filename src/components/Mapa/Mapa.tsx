"use client";

import { MapaProps, LeafletMapProps } from "@/types/types";
import dynamic from "next/dynamic";
import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

// Carrega o LeafletMap dinamicamente
const LeafletMapWithNoSSR = dynamic<LeafletMapProps>(() => import("../LeafletMap/LeafletMap"), {
    ssr: false, // Desabilita SSR para componentes Leaflet
    loading: () => (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50">
            <LoadingSpinner size={48} />
            <p className="text-center text-gray-500 mt-2">Carregando mapa...</p>
        </div>
    ),
});

export default function Mapa({ coordX, coordY, nomeCentro, zoom, abrigos, ocorrencias, onRouteInstructionsUpdate }: MapaProps) {
    // Passando as propriedades que vão para o mapa "real"
    const leafletMapProps: LeafletMapProps = {
        center: [coordX, coordY],
        nomeCentro: nomeCentro,
        zoom: zoom,
        abrigos: abrigos,
        ocorrencias: ocorrencias,
        onRouteInstructionsUpdate: onRouteInstructionsUpdate,
    };

    return (
        <div className="w-full h-full">
            <LeafletMapWithNoSSR {...leafletMapProps} />
        </div>
    );
}
