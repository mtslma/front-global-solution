"use client";
import React from "react";
import Image from "next/image";

export default function Integrantes() {
    // Informações do integrante
    const integrante = {
        nome: "Mateus da Silveira Lima",
        turma: "1TDSPA",
        rm: "RM559728",
        fotoUrl: "/outro/mateus.png",
        linkedinUrl: "https://www.linkedin.com/in/mtslma/",
        githubUrl: "https://github.com/mtslma/",
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-24 p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Título da Página */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">Integrantes do Projeto</h1>
                </div>

                {/* Card do Integrante*/}
                <div className="p-[3px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col items-center">
                            <div className="flex-shrink-0 mb-4">
                                <Image width={128} height={128} src={integrante.fotoUrl} alt={`Foto de ${integrante.nome}`} className="bg-gradient-to-br from-blue-500 to-indigo-600 w-32 h-32 rounded-full object-cover border-2" />
                            </div>
                            {/* Informações */}
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-700">{integrante.nome}</h2>
                                <p className="text-slate-800 text-sm mt-1">
                                    {integrante.turma} - {integrante.rm}
                                </p>

                                {/* Separador */}
                                <hr className="my-2 border-slate-200" />

                                {/* Links Sociais  */}
                                <div className="mt-3">
                                    <h3 className="text-md font-medium text-gray-600 mb-2">Conecte-se:</h3>
                                    <div className="flex justify-center space-x-5">
                                        <a href={integrante.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${integrante.nome}`} className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                            <i className="fab fa-linkedin fa-3x"></i>
                                        </a>
                                        <a
                                            href={integrante.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`GitHub de ${integrante.nome}`}
                                            className="text-gray-700 hover:text-gray-900 transition-colors duration-200" // Apenas transição de cor
                                        >
                                            <i className="fab fa-github fa-3x"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
