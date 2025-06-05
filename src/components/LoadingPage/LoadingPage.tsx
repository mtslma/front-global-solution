import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function LoadingPage() {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <LoadingSpinner size={64} />
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide text-center">Carregando...</h1>
                <p className="text-sm md:text-base opacity-75">Aguarde enquanto preparamos as informações.</p>
            </div>
        </div>
    );
}
