"use client";

import { AlertPopupProps } from "@/types/types";
import React, { useEffect, useRef } from "react";

// Componente para exibir um pop-up de alerta flutuante.
export default function AlertPopup({ message, type, isVisible, onClose, duration = 4000 }: AlertPopupProps) {
    // Referência para o elemento da barra de progresso para manipulação direta.
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Gerencia o auto-fechamento e a animação da barra de progresso.
    useEffect(() => {
        if (isVisible && duration) {
            // Configura o auto-fechamento do pop-up.
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            if (progressBarRef.current) {
                // Reinicia a animação CSS da barra de progresso e ajusta sua duração.
                progressBarRef.current.classList.remove("popup-progress-bar-animate");
                void progressBarRef.current.offsetWidth; // Força reflow para a animação reiniciar corretamente.
                progressBarRef.current.classList.add("popup-progress-bar-animate");
                progressBarRef.current.style.animationDuration = `${duration}ms`;
            }

            // Limpa o temporizador ao desmontar ou se as dependências mudarem.
            return () => clearTimeout(timer);
        } else if (!isVisible && progressBarRef.current) {
            // Reseta a barra de progresso quando o pop-up é ocultado.
            progressBarRef.current.classList.remove("popup-progress-bar-animate");
            progressBarRef.current.style.width = "100%";
        }
    }, [isVisible, duration, onClose]);

    // Não renderiza o componente se não estiver visível.
    if (!isVisible) {
        return null;
    }

    // Variáveis para estilos dinâmicos baseados no tipo de alerta.
    let baseBgColor = "";
    let progressBarBgColor = "";
    const textColor = "text-white";
    let iconClasses = "";

    // Define cores e ícone com base no tipo de alerta.
    switch (type) {
        case "success":
            baseBgColor = "bg-green-500";
            progressBarBgColor = "bg-green-700";
            iconClasses = "fa-solid fa-circle-check";
            break;
        case "error":
            baseBgColor = "bg-red-500";
            progressBarBgColor = "bg-red-700";
            iconClasses = "fa-solid fa-circle-exclamation";
            break;
        case "info":
        default:
            baseBgColor = "bg-blue-500";
            progressBarBgColor = "bg-blue-700";
            iconClasses = "fa-solid fa-circle-info";
            break;
    }

    return (
        // Contêiner principal do pop-up com estilos e transição de visibilidade.
        <div className={`fixed top-5 right-5 z-[100] w-auto max-w-md p-4 rounded-lg shadow-2xl flex items-start ${baseBgColor} ${textColor} transition-all duration-300 ease-in-out transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`} role="alert">
            {/* Ícone do alerta. */}
            {iconClasses && <i className={`${iconClasses} text-xl mr-3 mt-0.5 flex-shrink-0`}></i>}
            {/* Mensagem do alerta. */}
            <span className="flex-grow text-sm mr-3">{message}</span>
            {/* Botão para fechar manualmente. */}
            <button onClick={onClose} className={`ml-auto p-1 -mr-1 -mt-1 rounded-full hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white flex-shrink-0`} aria-label="Fechar">
                <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            {/* Barra de progresso visual. */}
            <div ref={progressBarRef} className={`absolute bottom-0 left-0 h-1.5 ${progressBarBgColor} rounded-bl-md rounded-br-md`} style={{ width: "100%" }}></div>
        </div>
    );
}
