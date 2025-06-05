"use client";

import React, { useEffect, useState, useRef, useCallback } from "react"; // Import useCallback
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression, LatLngTuple, LatLng, Routing } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { LeafletMapProps, Abrigo, CustomRoutingErrorEvent, CustomRoutingResultEvent, RoutingMachineProps } from "@/types/types";
import { traduzirInstrucao } from "@/services/traducao";
import MarcadoresOcorrencias from "@/components/Marcadores/MarcadoresOcorrencias/MarcadoresOcorrencias";
import MarcadoresAbrigos from "@/components/Marcadores/MarcadoresAbrigos/MarcadoresAbrigos";
import { criarIconeAbrigo, criarIconeAlerta } from "@/services/criar-icones";
import BotoesMapa from "@/components/BotoesMapa/BotoesMapa";
import CustomAlert from "@/components/CustomAlert/CustomAlert";
import getCircleOptions from "@/services/formatar-campos";

// Configuração de item padrão do leaflet
const defaultIconPrototype = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => void };
delete defaultIconPrototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
});

// Componentes auxiliares do mapa
function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// Função responsável por gerar uma rota segura que evita pontos dentro do círculo de ocorrência
function RoutingMachine({ start, end, onInstructionsChange, ocorrencias, showAlert }: RoutingMachineProps) {
    const map = useMap();
    const routingControlRef = useRef<Routing.Control | null>(null);

    useEffect(() => {
        if (!map) return;

        if (start && end) {
            const controlOptions: Routing.RoutingControlOptions = {
                waypoints: [L.latLng(start), L.latLng(end as LatLngTuple)],
                routeWhileDragging: true,
                show: false,
                addWaypoints: false,
                lineOptions: {
                    styles: [{ color: "#4F46E5", opacity: 0.8, weight: 6 }],
                    extendToWaypoints: false,
                    missingRouteTolerance: 0,
                },
            };

            if (!routingControlRef.current) {
                const control = L.Routing.control(controlOptions);
                control.addTo(map);
                routingControlRef.current = control;

                control.on("routesfound", (e: CustomRoutingResultEvent) => {
                    if (e.routes && e.routes.length > 0) {
                        const route = e.routes[0];
                        const instructionsOriginal = route.instructions;

                        const instructionsTraduzidas = instructionsOriginal.map((instr) => {
                            const instrucaoModificada = { ...instr };
                            if (instrucaoModificada.text) {
                                instrucaoModificada.text = traduzirInstrucao(instrucaoModificada.text);
                            }
                            return instrucaoModificada;
                        });

                        onInstructionsChange(instructionsTraduzidas);

                        let intersectsOccurrence = false;
                        if (route.coordinates && ocorrencias && ocorrencias.length > 0) {
                            for (const coord of route.coordinates) {
                                const routePoint = L.latLng(coord.lat, coord.lng);
                                for (const ocorr of ocorrencias) {
                                    const oLat = Number(ocorr.lat);
                                    const oLon = Number(ocorr.lon);
                                    if (isNaN(oLat) || isNaN(oLon)) continue;
                                    const oCenter = L.latLng(oLat, oLon);
                                    const oStyle = getCircleOptions(ocorr);
                                    if (routePoint.distanceTo(oCenter) < oStyle.radius) {
                                        intersectsOccurrence = true;
                                        break;
                                    }
                                }
                                if (intersectsOccurrence) break;
                            }
                        }
                        if (intersectsOccurrence) {
                            showAlert("A rota para o abrigo seguro ainda cruza uma ou mais áreas de ocorrência!", "⚠️ Cuidado!");
                        }
                    } else {
                        onInstructionsChange(null);
                    }
                });

                control.on("routingerror", (e: CustomRoutingErrorEvent) => {
                    console.error("ERRO DE ROTEAMENTO (LRM):", e.error.message);
                    showAlert(`Não foi possível calcular a rota: ${e.error.message}`, "Erro de Roteamento");
                    onInstructionsChange(null);
                });
            } else {
                routingControlRef.current.setWaypoints([L.latLng(start), L.latLng(end as LatLngTuple)]);
            }
        } else {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
            onInstructionsChange(null);
        }

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
            routingControlRef.current = null; // Garante a limpeza
        };
    }, [map, start, end, onInstructionsChange, ocorrencias, showAlert]);

    return null;
}

// Componente principal do mapa
export default function LeafletMap({ center, nomeCentro, zoom, ocorrencias = [], abrigos = [], onRouteInstructionsUpdate }: LeafletMapProps) {
    const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
    const [routeDestination, setRouteDestination] = useState<LatLngExpression | null>(null);
    const mapKey = center && typeof zoom === "number" ? `map-${(center as LatLngTuple)[0]}-${(center as LatLngTuple)[1]}-${zoom}` : "map-default";

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("Atenção");

    const showAlert = useCallback((message: string, title: string = "Atenção") => {
        setAlertMessage(message);
        setAlertTitle(title);
        setIsAlertOpen(true);
    }, []);

    const closeAlert = useCallback(() => {
        setIsAlertOpen(false);
    }, []);

    useEffect(() => {
        setUserLocation(null);
        setRouteDestination(null);
        if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
    }, [mapKey, onRouteInstructionsUpdate]);

    const isPointInCircle = (point: L.LatLng, circleCenter: L.LatLng, circleRadius: number): boolean => {
        return point.distanceTo(circleCenter) < circleRadius;
    };

    const getGeoAndSetRoute = useCallback(
        (destinationLogic: (userLoc: L.LatLng) => void) => {
            if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
            if (typeof window !== "undefined" && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const currentUserLoc = L.latLng(position.coords.latitude, position.coords.longitude);
                        setUserLocation(currentUserLoc);
                        destinationLogic(currentUserLoc);
                    },
                    (error: GeolocationPositionError) => {
                        console.error("Erro ao obter localização:", error.message);
                        showAlert(`Não foi possível obter sua localização: ${error.message}.\n\nPor favor, verifique as permissões de localização no seu navegador e tente novamente.`, "Erro de Geolocalização");
                        setUserLocation(null);
                        setRouteDestination(null);
                        if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                showAlert("A geolocalização não é suportada pelo seu navegador ou está desativada.\n\nPor favor, habilite-a ou tente em um navegador diferente.", "Geolocalização Indisponível");
                if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
            }
        },
        [onRouteInstructionsUpdate, showAlert]
    );

    const handleDirectRouteToShelter = useCallback(
        (shelterDestino: Abrigo) => {
            getGeoAndSetRoute(() => {
                const destinationCoord = L.latLng(Number(shelterDestino.lat), Number(shelterDestino.lon));
                setRouteDestination(destinationCoord);
            });
        },
        [getGeoAndSetRoute]
    );

    const handleRouteToNearestShelter = useCallback(() => {
        if (!abrigos || abrigos.length === 0) {
            showAlert("Nenhum abrigo disponível para traçar rota no momento.", "Sem Abrigos");
            if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
            return;
        }

        const safeCandidateAbrigos = abrigos.filter((abrigo) => {
            const abrigoLat = Number(abrigo.lat);
            const abrigoLon = Number(abrigo.lon);
            if (isNaN(abrigoLat) || isNaN(abrigoLon)) return false;
            const abrigoLoc = L.latLng(abrigoLat, abrigoLon);
            for (const ocorr of ocorrencias) {
                const oLat = Number(ocorr.lat);
                const oLon = Number(ocorr.lon);
                if (isNaN(oLat) || isNaN(oLon)) continue;
                const oCenter = L.latLng(oLat, oLon);
                const oStyle = getCircleOptions(ocorr); // Supondo que esta função não mude ou é pura
                if (isPointInCircle(abrigoLoc, oCenter, oStyle.radius)) return false;
            }
            return true;
        });

        if (safeCandidateAbrigos.length === 0) {
            showAlert("Todos os abrigos conhecidos estão em áreas de risco ou indisponíveis.\n\nNão é possível traçar uma rota segura no momento. Procure informações com as autoridades locais.", "Nenhum Abrigo Seguro");
            setUserLocation(null);
            setRouteDestination(null);
            if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
            return;
        }

        getGeoAndSetRoute((currentUserLoc) => {
            let nearestShelter: Abrigo | null = null;
            let minDistance = Infinity;
            safeCandidateAbrigos.forEach((abrigo) => {
                const shelterLat = Number(abrigo.lat);
                const shelterLon = Number(abrigo.lon);
                if (!isNaN(shelterLat) && !isNaN(shelterLon)) {
                    const shelterLoc = L.latLng(shelterLat, shelterLon);
                    const distance = currentUserLoc.distanceTo(shelterLoc);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestShelter = abrigo;
                    }
                }
            });

            if (nearestShelter) {
                const destinationCoord = L.latLng(Number((nearestShelter as { lat: number }).lat), Number((nearestShelter as { lon: number }).lon));
                setRouteDestination(destinationCoord);
            } else {
                showAlert("Não foi possível determinar o abrigo seguro mais próximo da lista filtrada.\n\nTente novamente ou verifique sua conexão.", "Erro ao Buscar Abrigo");
                setUserLocation(null);
                setRouteDestination(null);
                if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
            }
        });
    }, [abrigos, ocorrencias, getGeoAndSetRoute, onRouteInstructionsUpdate, showAlert]);

    // Função para limpar a rota
    const clearRouteHandler = useCallback(() => {
        setUserLocation(null);
        setRouteDestination(null);
        if (onRouteInstructionsUpdate) onRouteInstructionsUpdate(null);
    }, [onRouteInstructionsUpdate]);

    return (
        <div className="relative w-full h-full">
            <MapContainer key={mapKey} center={center} zoom={zoom} className="w-full h-full rounded-xl shadow-lg z-0">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                {/* Carregando marcador do centro da cidade */}
                <Marker position={center}>
                    <Popup>
                        <p className="font-bold text-center text-base mb-1">Ponto Central - {nomeCentro}</p>
                    </Popup>
                </Marker>
                <MapController center={center} zoom={zoom} />
                {/* Carregando marcadores de ocorrência */}
                <MarcadoresOcorrencias ocorrencias={ocorrencias} criarIconeAlerta={criarIconeAlerta} getCircleOptions={getCircleOptions} />
                {/* Carregando marcadores de abrigo */}
                <MarcadoresAbrigos abrigos={abrigos} criarIconeAbrigo={criarIconeAbrigo} handleDirectRouteToShelter={handleDirectRouteToShelter} />

                <RoutingMachine start={userLocation} end={routeDestination} onInstructionsChange={onRouteInstructionsUpdate || (() => {})} ocorrencias={ocorrencias} showAlert={showAlert} />
            </MapContainer>
            <BotoesMapa nomeCentro={nomeCentro} handleRouteToNearestShelter={handleRouteToNearestShelter} userLocation={userLocation} routeDestination={routeDestination} clearRouteHandler={clearRouteHandler} />

            <CustomAlert isOpen={isAlertOpen} message={alertMessage} title={alertTitle} onClose={closeAlert} />
        </div>
    );
}
