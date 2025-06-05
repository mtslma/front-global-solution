import { formatarCepDisplay } from "@/services/formatar-campos";
import { DetalhesCidadeSelecionadaProps } from "@/types/types";

export default function DetalhesCidadeSelecionada({ cidadeSelecionada, rotaInstrucoes, ocorrenciasAtuais, abrigosAtuais }: DetalhesCidadeSelecionadaProps) {
    if (!cidadeSelecionada || (rotaInstrucoes && rotaInstrucoes.length > 0)) {
        return null;
    }

    return (
        <div className="mt-auto pt-4 border-t border-gray-200 flex-shrink-0">
            <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg shadow-sm border border-indigo-200">
                    <h4 className="text-base font-semibold text-indigo-700 mb-2 text-center">Detalhes de {cidadeSelecionada.nomeCidade}</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p>
                            <span className="font-medium">Ponto central:</span> Lat: {cidadeSelecionada.lat.toFixed(5)}, Lon: {cidadeSelecionada.lon.toFixed(5)}
                        </p>
                        <p>
                            <span className="font-medium">CEP:</span> {formatarCepDisplay(cidadeSelecionada.cepCidade) || "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Ocorrências ativas:</span> {ocorrenciasAtuais.length}
                        </p>
                        <p>
                            <span className="font-medium">Abrigos registrados:</span> {abrigosAtuais.length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
