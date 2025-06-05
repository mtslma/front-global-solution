import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 text-gray-800 font-sans">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center w-full bg-gradient-to-br from-blue-200 to-indigo-400 text-gray-800 py-16 sm:py-20 md:py-28 px-4 sm:px-6 mt-12 lg:px-8">
                <div className="max-w-5xl">
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-extrabold text-indigo-700 leading-tight mb-6">Abrigos acessíveis e confiáveis em tempos de necessidade</h1>
                    <p className="text-xl sm:text-2xl text-gray-700 font-medium mb-10 max-w-4xl mx-auto">Nossa plataforma inovadora e de fácil utilização conecta você a abrigos seguros e fornece informações vitais durante desastres naturais e eventos extremos.</p>
                    <Link href="/login" className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 px-4 text-sm rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 sm:py-3 sm:px-8 sm:text-base md:py-4 md:px-10 md:text-lg">
                        Faça cadastro e comece a explorar!
                    </Link>
                </div>
            </section>

            {/* Seção 2: O Desafio */}
            <section className="py-16 md:py-24 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">A realidade dos desastres</h2>
                    <h2 className="text-2xl sm:text-2xl font-bold text-gray-700 mb-6"> Por que informação precisa salva vidas</h2>

                    <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">Quando desastres naturais ocorrem, a busca por um local seguro torna-se a prioridade máxima. A falta de informações claras e atualizadas sobre abrigos disponíveis e suas condições reais pode gerar angústia e colocar vidas em risco.</p>

                    <h3 className="text-2xl font-semibold text-gray-700 mb-8">Lições reais. Necessidades urgentes.</h3>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h4 className="text-xl font-bold text-indigo-600 mb-3">Enchentes RS (2024): A Luta por um Porto Seguro</h4>
                            <p className="text-gray-700 leading-relaxed">As inundações devastadoras de 2024 no Rio Grande do Sul deslocaram centenas de milhares de pessoas. Com cidades submersas, a necessidade por informações precisas sobre abrigos seguros, sua capacidade e condições tornou-se uma questão de sobrevivência, evidenciando a urgência de soluções como o Ponto Seguro.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                            <h4 className="text-xl font-bold text-indigo-600 mb-3">São Sebastião, SP (2023): A Busca por Refúgio</h4>
                            <p className="text-gray-700 leading-relaxed">As chuvas extremas e os deslizamentos trágicos em São Sebastião (SP) em 2023 deixaram milhares de desabrigados, reforçando a demanda crítica por sistemas eficazes que não apenas alertem, mas também indiquem refúgios seguros e acessíveis em áreas de risco iminente.</p>
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 mt-12 max-w-3xl mx-auto leading-relaxed">Esses eventos mostram que, em momentos de crise, ter acesso rápido a dados confiáveis sobre onde encontrar abrigo não é um luxo, mas uma necessidade fundamental.</p>
                </div>
            </section>

            {/* Seção 3: Apresentando Ponto Seguro */}
            <section className="py-16 md:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">Ponto Seguro: Tecnologia e Inteligência para Sua Proteção</h2>
                    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">O Ponto Seguro foi desenvolvido pela MTech para preencher essa lacuna vital. Nossa plataforma é mais do que um mapa; é um sistema inteligente e fácil de usar, projetado para guiar você à segurança quando mais precisa.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center md:items-start">
                            <i className="fa-solid fa-location-dot text-3xl text-indigo-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2 text-center md:text-left">Localização Rápida e Navegação Intuitiva</h4>
                            <p className="text-gray-600 text-sm leading-relaxed text-center md:text-left">Encontre abrigos próximos de forma eficiente em um mapa interativo. Interface simples e ágil, mesmo em situações de estresse.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center md:items-start">
                            <i className="fa-solid fa-brain text-3xl text-indigo-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2 text-center md:text-left">Previsão Inteligente de Lotação</h4>
                            <p className="text-gray-600 text-sm leading-relaxed text-center md:text-left">Nosso sistema de IA analisa dados para estimar a lotação dos abrigos, ajudando você a evitar locais superlotados e tomar decisões mais informadas.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center md:items-start">
                            <i className="fa-solid fa-filter text-3xl text-indigo-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2 text-center md:text-left">Filtros Personalizados</h4>
                            <p className="text-gray-600 text-sm leading-relaxed text-center md:text-left">Busque abrigos por capacidade, comodidades e nível de segurança previsto, encontrando o local ideal para suas necessidades.</p>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center md:items-start">
                            <i className="fa-solid fa-circle-info text-3xl text-indigo-500 mb-4"></i>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2 text-center md:text-left">Informações Centralizadas</h4>
                            <p className="text-gray-600 text-sm leading-relaxed text-center md:text-left">Acesse detalhes vitais: endereço, capacidade, recursos (água, sanitários, etc.) e status operacional atualizado de cada refúgio.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 4: Nossos Diferenciais */}
            <section className="py-16 md:py-24 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6">Navegue para a Segurança com Confiança e Clareza</h2>
                    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">Em um cenário onde cada segundo e cada informação contam, o Ponto Seguro oferece vantagens decisivas para garantir sua proteção.</p>
                    <div className="space-y-10">
                        <div className="md:flex items-center text-left bg-gray-50 p-8 rounded-lg shadow-md">
                            <div className="md:w-1/4 lg:w-1/5 mb-6 md:mb-0 md:mr-8 text-center">
                                <i className="fa-solid fa-route text-5xl text-indigo-500"></i>
                            </div>
                            <div className="md:w-3/4 lg:w-4/5">
                                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Localização Rápida e Roteamento Direto</h4>
                                <p className="text-gray-700 leading-relaxed">Nosso principal diferencial: não apenas identificamos abrigos próximos, mas calculamos e exibimos rotas claras e seguras até eles. Respondemos &quot;Onde ir?&quot; e &quot;Como chegar em segurança?&quot;.</p>
                            </div>
                        </div>
                        <div className="md:flex items-center text-left flex-row-reverse bg-gray-50 p-8 rounded-lg shadow-md">
                            <div className="md:w-1/4 lg:w-1/5 mb-6 md:mb-0 md:ml-8 text-center">
                                <i className="fa-solid fa-arrows-rotate text-5xl text-indigo-500"></i>
                            </div>
                            <div className="md:w-3/4 lg:w-4/5">
                                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Dados Confiáveis e Dinâmicos</h4>
                                <p className="text-gray-700 leading-relaxed">Mantemos os dados dos abrigos atualizados, incluindo a previsão de segurança. Futuramente, o feedback da comunidade enriquecerá ainda mais essas informações em tempo real.</p>
                            </div>
                        </div>
                        <div className="md:flex items-center text-left bg-gray-50 p-8 rounded-lg shadow-md">
                            <div className="md:w-1/4 lg:w-1/5 mb-6 md:mb-0 md:mr-8 text-center">
                                <i className="fa-solid fa-shield-heart text-5xl text-indigo-500"></i>
                            </div>
                            <div className="md:w-3/4 lg:w-4/5">
                                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Empoderando Comunidades Resilientes</h4>
                                <p className="text-gray-700 leading-relaxed">Acreditamos que a informação correta capacita. Ao fornecer uma ferramenta robusta, o Ponto Seguro contribui para aumentar a resiliência das comunidades, permitindo que os cidadãos protejam suas vidas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 5: Chamada para Ação Final */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-500 to-blue-500 text-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Esteja Preparado. Encontre Seu Ponto Seguro.</h2>
                    <p className="text-lg sm:text-xl mb-10 leading-relaxed">Não espere pela crise. Conheça a plataforma Ponto Seguro e saiba como podemos ajudar você a se manter seguro. Acesse agora e explore os abrigos disponíveis.</p>
                    <Link href="/mapa" className="bg-white hover:bg-gray-100 text-indigo-700 font-bold py-2 px-4 text-sm rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75 sm:py-3 sm:px-8 sm:text-base md:py-4 md:px-10 md:text-lg">
                        Acessar o mapa de Pontos Seguros
                    </Link>
                </div>
            </section>
        </main>
    );
}
