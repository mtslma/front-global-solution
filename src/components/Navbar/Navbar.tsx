"use client";
import { useEffect, useRef } from "react";
import { LinkNavegacao } from "../LinkNavegacao/LinkNavegacao"; // Assuming this component is correctly defined
import LinkGroupIndicator from "../GrupoLink/GrupoLink"; // Assuming this component is correctly defined

export default function Navbar(props: { menuOpen: boolean; setMenuOpen: (value: boolean) => void; toggleMenuState: () => void }) {
    const { menuOpen, setMenuOpen, toggleMenuState } = props;

    const sidebarRef = useRef<HTMLDivElement>(null);

    // Effect to handle clicks outside the sidebar to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // If the click is outside the sidebar, close the menu
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen, setMenuOpen]);

    // List of navigation links, memoized for potential performance benefit
    // (though likely not critical here unless LinkNavegacao or LinkGroupIndicator are heavy)
    const listaDeLinks = (
        <>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/"} iconName={"home"}>
                Início
            </LinkNavegacao>
            {/* Assuming LinkGroupIndicator is a non-interactive label or a dropdown trigger */}
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
            {/* Desktop Navigation: Hidden on small screens, visible on medium and larger screens */}
            <nav className="hidden md:flex md:flex-wrap lg:grid lg:grid-cols-4 lg:gap-2 xl:flex xl:flex-wrap items-center justify-center-safe px-2 gap-4">{listaDeLinks}</nav>

            {/* Mobile Navigation Elements */}
            {/* Backdrop: Shown when the menu is open to overlay page content */}
            {menuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black opacity-50 z-[990]" // z-index lower than sidebar
                    onClick={() => setMenuOpen(false)} // Close menu on backdrop click
                    aria-hidden="true" // For accessibility, as it's a purely visual overlay
                ></div>
            )}

            {/* Mobile Sidebar */}
            <aside
                // Increased z-index to z-[1000] to ensure it's above most other content, including maps.
                // Adjusted width for better fit, e.g., w-64 or w-72 might be common. w-[240px] is specific.
                className={`w-[240px] md:hidden fixed top-0 right-0 h-full z-[1000] bg-slate-100 text-gray-700 border-l border-gray-300 shadow-xl transition-transform duration-300 ease-in-out
                            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
                ref={sidebarRef}
                aria-labelledby="mobile-menu-title" // For accessibility
            >
                <div className="flex flex-col gap-4 p-4">
                    {/* Close Button for the sidebar */}
                    <button
                        onClick={toggleMenuState}
                        className="group text-2xl w-full border rounded-xl text-start px-4 py-2 hover:cursor-pointer hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Fechar menu" // For accessibility
                    >
                        <div className="text-xl flex items-center gap-4">
                            <i className="fa-solid fa-x text-xl group-hover:text-indigo-500 transition-colors" />
                            <span className="group-hover:underline">Fechar</span>
                        </div>
                    </button>

                    {/* Separator */}
                    <span className="w-full border-t border-gray-300" />

                    {/* Navigation Links within the sidebar */}
                    <nav className="flex flex-col gap-2">{listaDeLinks}</nav>
                </div>
            </aside>
        </>
    );
}
