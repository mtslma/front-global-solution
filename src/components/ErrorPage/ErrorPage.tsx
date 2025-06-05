"use client";

import { ErrorPageProps } from "@/types/types";
import Link from "next/link";

// Componente funcional ErrorPage que recebe a mensagem de erro como propriedade.
export default function ErrorPage({ error }: ErrorPageProps) {
    return (
        // Contêiner principal que ocupa no mínimo toda a altura da tela,
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 text-center font-sans">
            {/* Contêiner para o conteúdo da página de erro, com largura máxima e centralizado. */}
            <div className="max-w-lg w-full">
                {/* Ícone de aviso/exclamação para indicar um erro. */}
                <i className="fa-triangle-exclamation fa-solid text-red-500 text-6xl md:text-8xl mb-6"></i>
                {/* Título principal da página de erro. */}
                <h1 className="text-2xl md:text-3xl font-semibold text-indigo-700 mb-2">Ops! Algo deu errado.</h1>
                {/* Parágrafo para exibir os detalhes específicos do erro. */}
                <p className="text-lg md:text-xl text-red-600 font-medium mb-6 break-words">
                    Detalhes: <span className="font-normal">{error}</span>
                </p>
                {/* Mensagem genérica para o usuário com sugestão de ação. */}
                <p className="text-gray-600 mb-8">Parece que encontramos um problema. Por favor, tente novamente ou volte para a página inicial.</p>
                {/* Link para redirecionar o usuário de volta para a página inicial. */}
                <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-100 transition-all duration-150 ease-in-out transform hover:scale-105">
                    {/* Ícone de seta para a esquerda, indicando "voltar". */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Voltar para a página inicial
                </Link>
            </div>
        </div>
    );
}
