// Componente que exibe o nome do grupo de link em dispositivos mobile
export default function LinkGroupIndicator(props: { children: React.ReactNode }) {
    const { children } = props;
    return <p className="md:hidden text-xs text-gray-600 dark:text-gray-400 font-bold">{children}</p>;
}
