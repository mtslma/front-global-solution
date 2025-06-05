import { formatDistance, getInstructionIcon } from "@/services/traduzir-rota";
import { Routing } from "leaflet";

interface DetalhesRotaTracadaProps {
    rotaInstrucoes: Routing.IInstruction[] | null;
}

export default function DetalhesRotaTracada({ rotaInstrucoes }: DetalhesRotaTracadaProps) {
    const temInstrucoes = rotaInstrucoes && rotaInstrucoes.length > 0;

    return (
        <div
            className={`mt-2 pt-3 border-t border-gray-200 flex flex-col flex-grow min-h-0 transition-all duration-300 ease-in-out ${
                temInstrucoes ? "opacity-100 visible flex-grow" : "opacity-0 invisible h-0" // Controla altura e visibilidade
            }`}
        >
            {temInstrucoes && (
                <>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2.5 flex-shrink-0">Instruções da Rota:</h3>
                    <ul
                        className="space-y-2 overflow-y-auto pr-2 text-sm text-gray-700 custom-scrollbar flex-grow 
                                  max-h-[80vh] lg:max-h-[calc(100vh-28rem)]" // Ajustar max-h conforme necessidade da sidebar
                    >
                        {rotaInstrucoes.map((instr, index) => (
                            <li key={index} className="flex items-start gap-2.5 p-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-150">
                                <span className="font-bold text-indigo-600 w-7 h-7 flex items-center justify-center text-lg pt-0.5 flex-shrink-0" aria-hidden="true">
                                    {getInstructionIcon(instr.type)}
                                </span>
                                <span className="flex-grow leading-relaxed">{instr.text}</span>
                                {instr.distance > 0 && <span className="ml-auto text-xs text-indigo-600 whitespace-nowrap font-semibold pt-0.5 flex-shrink-0">{formatDistance(instr.distance)}</span>}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
