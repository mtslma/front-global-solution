export default function Footer() {
    return (
        <footer className="bg-slate-100 py-2 text-slate-700 text-center">
            <div className="container mx-auto px-4">
                <p className="text-sm md:text-base">
                    FIAP Global Solution 2° Semestre |{" "}
                    <a href="/integrantes" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                        Ver integrantes do grupo
                    </a>
                </p>
            </div>
        </footer>
    );
}
