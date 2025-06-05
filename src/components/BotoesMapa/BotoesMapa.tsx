import { BotoesMapaProps } from "@/types/types";
import React from "react";

export default function BotoesMapa({ nomeCentro, handleRouteToNearestShelter, userLocation, routeDestination, clearRouteHandler }: BotoesMapaProps) {
    const isRouteActive = userLocation && routeDestination;

    return (
        <div className="absolute top-3 right-3 z-[700] flex flex-col gap-2 items-end">
            {/* Botão para traçar a rota */}
            <p className="bg-indigo-600 text-white font-semibold py-1.5 px-3 rounded-lg shadow-md text-xs sm:text-sm">{nomeCentro}</p>
            <button onClick={handleRouteToNearestShelter} className={`w-auto min-w-[120px] hover:cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-colors text-xs sm:text-sm items-center justify-center gap-2 ${isRouteActive ? "hidden" : "flex"}`} title="Traçar rota para o abrigo mais próximo (fora de áreas de ocorrência)">
                <i className="fa-solid fa-house-medical mr-1.5"></i> <span>Buscar Abrigo Seguro</span>
            </button>
            {/* Botão para limpar a rota */}
            {isRouteActive && (
                <button onClick={clearRouteHandler} className="w-auto min-w-[120px] bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-colors text-xs sm:text-sm flex items-center justify-center gap-2" title="Limpar rota atual">
                    <i className="fa-solid fa-times-circle mr-1.5"></i> <span>Limpar Rota</span>
                </button>
            )}
        </div>
    );
}
