export interface CustomAlertProps {
    isOpen: boolean;
    message: string;
    title?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    hideCloseButton?: boolean;
}

export default function CustomAlert({ isOpen, message, title = "Atenção", onClose, onConfirm, confirmButtonText, cancelButtonText, hideCloseButton = false }: CustomAlertProps) {
    if (!isOpen) {
        return null;
    }

    const handleConfirmClick = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    const isConfirmationDialog = typeof onConfirm === "function";

    return (
        <div
            className="fixed inset-0 bg-[rgba(17,24,39,0.6)] flex items-center justify-center z-[900] p-4"
            onClick={onClose} // Permite fechar clicando fora (opcional, remova se não desejar)
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md transform transition-all duration-300 ease-out scale-100"
                onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    {!hideCloseButton && (
                        <button onClick={onClose} className="text-gray-500 hover:cursor-pointer hover:text-gray-700 text-2xl font-bold p-1 -m-1 leading-none" aria-label="Fechar">
                            &times;
                        </button>
                    )}
                </div>
                <p className="text-gray-700 mb-6 whitespace-pre-wrap">{message}</p>
                <div className="flex justify-end space-x-3">
                    {isConfirmationDialog && (
                        <button
                            onClick={onClose} // Botão Cancelar
                            className="bg-gray-200 hover:cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 sm:px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors duration-150"
                        >
                            {cancelButtonText || "Cancelar"}
                        </button>
                    )}
                    <button
                        onClick={isConfirmationDialog ? handleConfirmClick : onClose}
                        className={`font-semibold py-2 px-4 sm:px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 ${
                            isConfirmationDialog
                                ? "bg-red-600 hover:cursor-pointer hover:bg-red-700 text-white focus:ring-red-500" // Estilo para botão de confirmação destrutiva
                                : "bg-indigo-600 hover:cursor-pointer hover:bg-indigo-700 text-white focus:ring-indigo-500" // Estilo para botão OK padrão
                        }`}
                    >
                        {isConfirmationDialog ? confirmButtonText || "Confirmar" : confirmButtonText || "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
}
