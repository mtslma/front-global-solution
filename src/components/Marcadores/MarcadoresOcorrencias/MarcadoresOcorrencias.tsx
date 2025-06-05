import React from "react";
import { Marker, Popup, Circle } from "react-leaflet";
import { LatLngExpression, DivIcon, PathOptions } from "leaflet";
import { Ocorrencia } from "@/types/types";
import Link from "next/link";

// Definindo a interface para o estilo do círculo, se não estiver já em types.ts
interface CircleStyle {
    radius: number;
    pathOptions: PathOptions;
}

interface MarcadoresOcorrenciasProps {
    ocorrencias: Ocorrencia[];
    criarIconeAlerta: (tipoOcorrencia: Ocorrencia["tipoOcorrencia"]) => DivIcon;
    getCircleOptions: (ocorrencia: Ocorrencia) => CircleStyle;
}

export default function MarcadoresOcorrencias({ ocorrencias, criarIconeAlerta, getCircleOptions }: MarcadoresOcorrenciasProps) {
    if (!ocorrencias || ocorrencias.length === 0) {
        return null;
    }

    return (
        <>
            {ocorrencias.map((ocorrencia) => {
                const lat = Number(ocorrencia.lat);
                const lon = Number(ocorrencia.lon);

                if (isNaN(lat) || isNaN(lon)) {
                    console.warn(`Coordenadas inválidas para ocorrência ID ${ocorrencia.idOcorrencia}: lat=${ocorrencia.lat}, lon=${ocorrencia.lon}`);
                    return null; // Não renderiza este marcador se as coordenadas forem inválidas
                }

                const position: LatLngExpression = [lat, lon];
                const icon = criarIconeAlerta(ocorrencia.tipoOcorrencia);
                const circleStyle = getCircleOptions(ocorrencia);

                return (
                    <React.Fragment key={`${ocorrencia.idOcorrencia}-group`}>
                        <Marker position={position} icon={icon}>
                            <Popup>
                                <div className="text-sm flex flex-col gap-1.5">
                                    <strong className="text-base block">{ocorrencia.tipoOcorrencia.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</strong>
                                    {ocorrencia.nivelGravidade && (
                                        <p>
                                            Nível:{" "}
                                            <span
                                                className={`font-semibold text-white px-1.5 py-0.5 rounded-full text-xs ${
                                                    ocorrencia.nivelGravidade.toUpperCase() === "CRÍTICO" || ocorrencia.nivelGravidade.toUpperCase() === "ALTO" ? "bg-red-600" : ocorrencia.nivelGravidade.toUpperCase() === "MÉDIO" || ocorrencia.nivelGravidade.toUpperCase() === "MODERADO" ? "bg-amber-500" : "bg-green-500" // Default ou "BAIXO"
                                                }`}
                                            >
                                                {ocorrencia.nivelGravidade.toUpperCase()}
                                            </span>
                                        </p>
                                    )}
                                    {ocorrencia.dataCriacao && <p className="text-xs text-gray-500">Reg.: {new Date(ocorrencia.dataCriacao).toLocaleString()}</p>}
                                    <Link
                                        target="_blank"
                                        href={`/detalhes-ocorrencia/${ocorrencia.idOcorrencia}`}
                                        className="mt-1 w-full text-xs text-center text-white bg-blue-700 hover:bg-blue-600 font-semibold py-1 px-2 rounded shadow hover:shadow-md transition-all block" // Adicionado text-center e block
                                    >
                                        <span className="text-white">Ver detalhes da ocorrência</span>
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle center={position} radius={circleStyle.radius} pathOptions={circleStyle.pathOptions} />
                    </React.Fragment>
                );
            })}
        </>
    );
}
