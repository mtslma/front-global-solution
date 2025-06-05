"use client";

import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Link from "next/link";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    // Função para abrir/ fechar menu, altera o state salvo
    function toggleMenuState() {
        setMenuOpen(!menuOpen);
    }

    return (
        <header className="max-w-screen flex items-center justify-between p-2 bg-white">
            <Link href="/" className="py-1 inline-block text-3xl sm:text-4xl font-bold text-transparent overflow-visible bg-clip-text bg-gradient-to-b from-blue-500 to-indigo-500 hover:opacity-90 transition-opacity duration-100" onClick={() => setMenuOpen(false)}>
                Ponto Seguro
            </Link>

            {/* Botão para abrir a navbar, aparece apenas no no mobile */}
            <button className="md:hidden hover:cursor-pointer" onClick={toggleMenuState}>
                <i className="py-1 fa-solid fa-bars text-2xl text-indigo-500" />
            </button>

            {/* Puxando o componente de navbar para a lógica de exibição dos ícones */}
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} toggleMenuState={toggleMenuState}></Navbar>
        </header>
    );
}
