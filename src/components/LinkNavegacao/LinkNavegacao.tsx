"use client";

import { LinkProps } from "@/types/types";
import Link from "next/link";
import React from "react";

export function LinkNavegacao({ href, iconName, children, toggleMenu }: LinkProps) {
    return (
        <Link
            href={href}
            onClick={toggleMenu} // Chama a função para fechar o menu ao clicar
            className="border-none group flex items-center px-4 py-3 rounded-lg  text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-indigo-50 transition-all duration-200 ease-in-out"
        >
            {/* Ícone */}
            <i className={`fa-solid fa-${iconName} text-indigo-500 group-hover:text-indigo-700 text-lg w-6 text-center mr-3 transition-colors duration-200`} />
            {/* Texto do Link */}
            <span className="text-base font-bold">{children}</span>
        </Link>
    );
}
