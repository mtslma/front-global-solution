"use client";
import { useEffect, useRef } from "react";
import { LinkNavegacao } from "../LinkNavegacao/LinkNavegacao";
import LinkGroupIndicator from "../GrupoLink/GrupoLink";

// Componente da barra de navegação
export default function Navbar(props: { menuOpen: boolean; setMenuOpen: (value: boolean) => void; toggleMenuState: () => void }) {
    const { menuOpen, setMenuOpen, toggleMenuState } = props; // Props para controlar o estado do menu

    const sidebarRef = useRef<HTMLDivElement>(null); // Referência para o elemento da barra lateral

    // Efeito para fechar a barra lateral ao clicar fora dela
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Se o clique não for dentro da barra lateral, fecha o menu
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        // Adiciona ou remove o ouvinte de evento conforme o estado do menu
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Limpa o ouvinte de evento ao desmontar o componente ou antes de re-executar o efeito
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen, setMenuOpen]); // Dependências do efeito: re-executa se 'menuOpen' ou 'setMenuOpen' mudarem

    // Lista de links para a navegação
    const listaDeLinks = (
        <>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/"} iconName={"home"}>
                Início
            </LinkNavegacao>
            {/* Indicador de grupo de links ou apenas um título */}
            <LinkGroupIndicator>Explorar</LinkGroupIndicator>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/mapa"} iconName={"map"}>
                Mapa
            </LinkNavegacao>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/perfil"} iconName={"user"}>
                Perfil
            </LinkNavegacao>
        </>
    );

    return (
        <>
            {/* Navegação para Desktop: oculta em telas pequenas, visível a partir de 'md' */}
            <nav className="hidden md:flex md:flex-wrap lg:grid lg:grid-cols-4 lg:gap-2 xl:flex xl:flex-wrap items-center justify-center-safe px-2 gap-4">{listaDeLinks}</nav>

            {/* Elementos da Navegação Mobile */}
            {/* Fundo escurecido (backdrop) quando o menu mobile está aberto */}
            {menuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black opacity-50 z-[990]" // Posicionado abaixo da sidebar
                    onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar no fundo
                    aria-hidden="true" // Para acessibilidade, indica que é um elemento visual
                ></div>
            )}

            {/* Barra Lateral Mobile (Sidebar) */}
            <aside
                // z-index alto para sobrepor outros conteúdos, como mapas.
                // Largura específica de 240px.
                className={`w-[240px] md:hidden fixed top-0 right-0 h-full z-[1000] bg-slate-100 text-gray-700 border-l border-gray-300 shadow-xl transition-transform duration-300 ease-in-out
                            ${menuOpen ? "translate-x-0" : "translate-x-full"}`} // Animação de entrada/saída da sidebar
                ref={sidebarRef} // Atribui a referência do DOM
                aria-labelledby="mobile-menu-title" // Para acessibilidade, relaciona ao título (se houver)
            >
                <div className="flex flex-col gap-4 p-4">
                    {" "}
                    {/* Conteúdo interno da sidebar */}
                    {/* Botão para fechar a sidebar mobile */}
                    <button
                        onClick={toggleMenuState}
                        className="group text-2xl w-full border rounded-xl text-start px-4 py-2 hover:cursor-pointer hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Fechar menu" // Rótulo para acessibilidade
                    >
                        <div className="text-xl flex items-center gap-4">
                            <i className="fa-solid fa-x text-xl group-hover:text-indigo-500 transition-colors" /> {/* Ícone de fechar */}
                            <span className="group-hover:underline">Fechar</span>
                        </div>
                    </button>
                    {/* Linha separadora */}
                    <span className="w-full border-t border-gray-300" />
                    {/* Links de navegação dentro da sidebar mobile */}
                    <nav className="flex flex-col gap-2">{listaDeLinks}</nav>
                </div>
            </aside>
        </>
    );
}
