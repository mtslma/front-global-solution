// Exemplo para: app/not-found.tsx (Next.js App Router)
// Ou pode ser um componente reutilizável: src/components/NotFoundPage/NotFoundPage.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center text-center p-6 sm:p-8 font-sans">
            <div className="max-w-lg w-full">
                {/* "404" */}
                <h1 className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-extrabold leading-none select-none">
                    <span className="bg-gradient-to-b from-blue-400 to-indigo-700 text-transparent bg-clip-text">404</span>
                </h1>
                {/* Mensagem Principal */}
                <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-indigo-700">Página Não Encontrada</h2>
                {/* Link para Voltar para a Página Inicial */}
                <div className="mt-8 sm:mt-10">
                    <Link href="/" legacyBehavior>
                        <a className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-100 transition-all duration-150 ease-in-out transform hover:scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Voltar para a Página Inicial
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
