export default function LoadingSpinner({ size }: { size: number }) {
    return (
        <div style={{ width: size, height: size }} className="relative flex items-center justify-center rounded-full animate-spin bg-gradient-to-b from-blue-400 to-indigo-700 p-1">
            <div className="w-full h-full bg-white rounded-full" style={{ width: size - 8, height: size - 8 }}></div>
        </div>
    );
}
