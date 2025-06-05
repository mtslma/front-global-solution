import React from "react";
import { Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { MarcadoresAbrigosProps } from "@/types/types";
import { formatarCepDisplay, formatarTelefoneDisplay } from "@/services/formatar-campos";

export default function MarcadoresAbrigos({ abrigos, criarIconeAbrigo, handleDirectRouteToShelter }: MarcadoresAbrigosProps) {
    if (!abrigos || abrigos.length === 0) {
        return null;
    }

    return (
        <>
            {abrigos.map((abrigo) => {
                const lat = Number(abrigo.lat);
                const lon = Number(abrigo.lon);

                if (isNaN(lat) || isNaN(lon)) {
                    console.warn(`Coordenadas inválidas para abrigo ID ${abrigo.idAbrigo}: lat=${abrigo.lat}, lon=${abrigo.lon}`);
                    return null; // Não renderiza este marcador se as coordenadas forem inválidas
                }

                const position: LatLngExpression = [lat, lon];
                const icon = criarIconeAbrigo(); // Chama a função passada por props

                return (
                    <Marker key={`abrigo-${abrigo.idAbrigo}`} position={position} icon={icon}>
                        <Popup>
                            <div className="text-sm flex flex-col gap-1.5">
                                <strong className="text-base block">{abrigo.nomeAbrigo || "Abrigo"}</strong>
                                <p>Endereço: {abrigo.enderecoAbrigo || "Não informado"}</p>
                                <p>Capacidade: {abrigo.capacidadeMaxima || "N/A"}</p>
                                <p>CEP: {formatarCepDisplay(abrigo.cep) || "N/A"}</p>
                                <p>Status: {abrigo.statusFuncionamento || "Não informado"}</p>
                                <p>Contato: {formatarTelefoneDisplay(abrigo.telefoneContato) || "Não informado"}</p>
                                <button onClick={() => handleDirectRouteToShelter(abrigo)} className="mt-1 w-full text-xs bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded shadow hover:shadow-md transition-all">
                                    Rota para este Abrigo
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}
