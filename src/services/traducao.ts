// Tive vários problemas tentando fazer a rota vir em português na hora de chamar a API, por conta do tempo para fazer o projeto
// Acabei optando por traduzir "na mão, por isso esse arquivo
// Idealmente eu trocaria a forma que as rotas são geradas mas não vou ter tempo de refazer, então se tiver alguma coisa em inglês, esse é o motivo :(

const direcoesPt: { [key: string]: string } = {
    north: "norte", south: "sul", east: "leste", west: "oeste",
    northeast: "nordeste", northwest: "noroeste",
    southeast: "sudeste", southwest: "sudoeste"
};

const modificadoresCurvaPt: { [key: string]: string } = {
    'sharp left': "acentuadamente à esquerda",
    'left': "à esquerda",
    'slight left': "levemente à esquerda",
    'sharp right': "acentuadamente à direita",
    'right': "à direita",
    'slight right': "levemente à direita",
};

function formatarUnidadeDistanciaPt(valor: string, unidadeEn: string): string {
    let unidadePt = unidadeEn.toLowerCase();
    if (unidadePt === 'miles') unidadePt = 'milhas';
    else if (unidadePt === 'yards') unidadePt = 'jardas';
    else if (unidadePt === 'feet') unidadePt = 'pés';
    return `${valor} ${unidadePt}`;
}

function formatarOrdinalPt(numeroSaidaStr: string): string {
    const n = parseInt(numeroSaidaStr, 10);
    if (n === 1) return "1ª";
    if (n === 2) return "2ª";
    if (n === 3) return "3ª";
    if (n >= 4) return `${n}ª`;
    return numeroSaidaStr;
}

interface RegraTraducao {
    regex: RegExp;
    replacer: (match: RegExpMatchArray) => string;
}

const regrasTraducao: RegraTraducao[] = [
    // Chegadas
    {
        regex: /^You have arrived at your destination, on the (left|right)$/i,
        replacer: (match) => `Você chegou ao seu destino, à ${match[1].toLowerCase() === 'left' ? 'esquerda' : 'direita'}`
    },
    {
        regex: /^You have arrived at your destination$/i,
        replacer: () => "Você chegou ao seu destino"
    },
    { regex: /^Destination reached$/i, replacer: () => "Destino alcançado" },
    { regex: /^Waypoint reached$/i, replacer: () => "Ponto de parada alcançado" },

    // Rotatórias: Ex: "At the roundabout, take the 1st exit onto Main Street for 1.2 km"
    {
        regex: /^At the roundabout, take the (\d+)(?:st|nd|rd|th) exit(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, numeroSaida, nomeRua, valorDist, undDist] = match;
            let res = `Na rotatória, pegue a ${formatarOrdinalPt(numeroSaida)} saída`;
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` e siga por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    // Curvas: Ex: "Turn left onto Main Street for 1.2 km"
    {
        regex: /^Turn (sharp left|left|slight left|sharp right|right|slight right)(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, modificador, nomeRua, valorDist, undDist] = match;
            let res = `Vire ${modificadoresCurvaPt[modificador.toLowerCase()]}`;
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` e siga por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    {
        regex: /^Make a U-turn(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, nomeRua, valorDist, undDist] = match;
            let res = "Faça o retorno";
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` e siga por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    // Siga (Head): Ex: "Head southeast on Main St for 1.2 km" ou "Head north for 500 m"
    {
        regex: /^Head (north|south|east|west|northeast|northwest|southeast|southwest)(?: on (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, direcaoEn, nomeRua, valorDist, undDist] = match;
            let res = `Siga para ${direcoesPt[direcaoEn.toLowerCase()]}`;
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    // Continue: Ex: "Continue on Main St for 1.2 km" ou "Continue for 500m" ou "Continue"
    {
        regex: /^Continue(?: straight)?(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            // eslint-disable-next-line prefer-const
            let [, nomeRua, valorDist, undDist] = match;
             if (nomeRua && nomeRua.toLowerCase().startsWith('on ')) {
                nomeRua = nomeRua.substring(3);
            }

            let res = "Continue";
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            
            if (valorDist && undDist) {
                 if (!nomeRua) res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`; // "Continue for 1km"
                 else res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`; // "Continue on Road for 1km"
            } else if (!nomeRua && !valorDist) { // Apenas "Continue" ou "Continue Straight"
                res = "Continue reto";
            }
            return res;
        }
    },
    // Bifurcações: Ex: "Keep left at the fork onto Main St"
    {
        regex: /^Keep (left|right) at the fork(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, direcao, nomeRua, valorDist, undDist] = match;
            let res = `Mantenha-se à ${direcao.toLowerCase() === 'left' ? 'esquerda' : 'direita'} na bifurcação`;
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    // Mantenha-se (genérico): Ex: "Keep right onto Main St"
    {
        regex: /^Keep (left|right)(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, direcao, nomeRua, valorDist, undDist] = match;
            let res = `Mantenha-se à ${direcao.toLowerCase() === 'left' ? 'esquerda' : 'direita'}`;
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    // Entrar / Fundir: Ex: "Merge onto Main St"
    {
        regex: /^Merge(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, nomeRua, valorDist, undDist] = match;
            let res = "Entre"; // Ou "Incorpore"
            if (nomeRua) res += ` na ${nomeRua.trim()}`;
            if (valorDist && undDist) res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
    // Rampa / Saída: Ex: "Take the ramp onto I-5 N" ou "Exit onto Main St"
    {
        regex: /^(Take the ramp|Exit)(?: onto (.+?))?(?: for ([\d.]+) (km|m|miles|yards|feet))?$/i,
        replacer: (match) => {
            const [, acao, nomeRua, valorDist, undDist] = match;
            let res = acao.toLowerCase() === 'exit' ? "Saia" : "Pegue a rampa";
            if (nomeRua) res += ` para ${nomeRua.trim()}`; // "para" pode soar melhor aqui
            if (valorDist && undDist) res += ` por ${formatarUnidadeDistanciaPt(valorDist, undDist)}`;
            return res;
        }
    },
];

export function traduzirInstrucaoNaMarra(textoIngles: string): string {
    if (!textoIngles || typeof textoIngles !== 'string') {
        return ""; 
    }
    const textoLimpo = textoIngles.trim();
    for (const regra of regrasTraducao) {
        const match = textoLimpo.match(regra.regex);
        if (match) {
            return regra.replacer(match);
        }
    }
    let textoFallback = textoLimpo;
    textoFallback = textoFallback.replace(/(\d*\.?\d+)\s*miles/gi, '$1 milhas');
    textoFallback = textoFallback.replace(/(\d*\.?\d+)\s*yards/gi, '$1 jardas');
    textoFallback = textoFallback.replace(/(\d*\.?\d+)\s*feet/gi, '$1 pés');
    if (textoFallback !== textoLimpo) {
        console.warn(`Tradução por fallback (unidades) para: "<span class="math-inline">\{textoIngles\}" \-\> "</span>{textoFallback}"`);
        return textoFallback;
    }
    console.warn(`Tradução não encontrou regra para: "${textoIngles}"`);
    return textoIngles;
}

export function traduzirInstrucao(textoIngles: string): string {
    if (!textoIngles || typeof textoIngles !== 'string') {
        return ""; 
    }
    const textoLimpo = textoIngles.trim();
    for (const regra of regrasTraducao) {
        const match = textoLimpo.match(regra.regex);
        if (match) {
            return regra.replacer(match);
        }
    }
    let textoFallback = textoLimpo;
    textoFallback = textoFallback.replace(/(\d*\.?\d+)\s*miles/gi, '$1 milhas');
    textoFallback = textoFallback.replace(/(\d*\.?\d+)\s*yards/gi, '$1 jardas');
    textoFallback = textoFallback.replace(/(\d*\.?\d+)\s*feet/gi, '$1 pés');
    if (textoFallback !== textoLimpo) {
        console.warn(`Tradução por fallback (unidades) para: "<span class="math-inline">\{textoIngles\}" \-\> "</span>{textoFallback}"`);
        return textoFallback;
    }
    console.warn(`Tradução "na marra" não encontrou regra para: "${textoIngles}"`);
    return textoIngles;
}