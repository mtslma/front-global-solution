export default function LoadingSpinner({ size }: { size: number }) {
    return (
        <div
            style={{ width: size, height: size }}
            className="relative flex items-center justify-center rounded-full animate-spin
                 bg-gradient-to-b from-blue-400 to-indigo-700 p-1" // O 'p-1' simula a espessura da borda com gradiente
        >
            <div
                className="w-full h-full bg-white rounded-full" // Fundo branco preenchendo o centro
                style={{ width: size - 8, height: size - 8 }} // Subtrai o dobro do 'p-1' para o tamanho do "buraco"
            ></div>
        </div>
    );
}
