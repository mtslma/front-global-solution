// Supondo que este arquivo esteja em: src/components/AbrigosPageSecoes/RegistrarAbrigoForm.tsx
// ou similar, ajuste o caminho da importação de Cidade se necessário.
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Cidade } from "@/types/types"; // Certifique-se que Cidade tem idCidade e nomeCidade

// Tipagem para os dados do formulário de abrigo
interface NovoAbrigoFormData {
    idCidade: string;
    nomeAbrigo: string;
    cep: string;
    capacidadeMaxima: string; // Mantido como string, a conversão para número ocorre no handler principal
    enderecoAbrigo: string;
    telefoneContato: string;
    statusFuncionamento: "NORMAL" | "PARCIAL" | "INTERDITADO" | string;
    nivelSegurancaAtual: "ALTO" | "MÉDIO" | "BAIXO" | string;
}

// Opções para os selects, conforme solicitado
const opNivelSeguranca = ["ALTO", "MÉDIO", "BAIXO"];
const opStatusFuncionamento = ["NORMAL", "PARCIAL", "INTERDITADO"];

interface RegistrarAbrigoFormProps {
    // Função que vem da página AbrigosPage para lidar com a lógica de API
    onFormSubmit: SubmitHandler<NovoAbrigoFormData>;
    isSubmitting: boolean; // Estado de loading/submissão vindo da AbrigosPage
    todasCidades: Cidade[]; // Lista de cidades para o select
    // Classes de estilização opcionais para o <section> (o card)
    className?: string;
}

// Valores padrão para o formulário, para uso no useForm e no reset
const defaultAbrigoFormValues: NovoAbrigoFormData = {
    idCidade: "",
    nomeAbrigo: "",
    cep: "",
    capacidadeMaxima: "",
    enderecoAbrigo: "",
    telefoneContato: "",
    statusFuncionamento: "NORMAL",
    nivelSegurancaAtual: "ALT0",
};

export default function RegistrarAbrigoForm({
    onFormSubmit,
    isSubmitting,
    todasCidades,
    className = "lg:col-span-3 p-6 bg-white rounded-xl shadow-xl border border-gray-200", // Classes default para o card
}: RegistrarAbrigoFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<NovoAbrigoFormData>({
        defaultValues: defaultAbrigoFormValues,
    });

    // Observa os valores dos campos CEP e Telefone para formatação manual
    const cepValue = watch("cep");
    const telefoneValue = watch("telefoneContato");

    // --- Funções de Formatação ---

    // Função para formatar o CEP (XXXXX-XXX)
    const formatCep = (value: string | undefined): string => {
        if (!value) return "";
        let cleanedValue = value.replace(/\D/g, ""); // Remove não numéricos
        if (cleanedValue.length > 8) cleanedValue = cleanedValue.substring(0, 8); // Limita a 8 dígitos

        if (cleanedValue.length > 5) {
            return `${cleanedValue.substring(0, 5)}-${cleanedValue.substring(5)}`;
        }
        return cleanedValue;
    };

    // Função para formatar o Telefone ( (XX) XXXXX-XXXX ou (XX) XXXX-XXXX )
    const formatTelefone = (value: string | undefined): string => {
        if (!value) return "";
        let cleanedValue = value.replace(/\D/g, ""); // Remove não numéricos

        if (cleanedValue.length > 11) cleanedValue = cleanedValue.substring(0, 11); // Limita a 11 dígitos (com 9 extra)

        if (cleanedValue.length > 10) {
            // Celular com 9 (XX) 9XXXX-XXXX
            return `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(2, 7)}-${cleanedValue.substring(7, 11)}`;
        } else if (cleanedValue.length > 6) {
            // Telefone fixo (XX) XXXX-XXXX ou celular incompleto
            return `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(2, 6)}-${cleanedValue.substring(6, 10)}`;
        } else if (cleanedValue.length > 2) {
            // DDD ou DDD parcial
            return `(${cleanedValue.substring(0, 2)}) ${cleanedValue.substring(2)}`;
        }
        return cleanedValue;
    };

    // --- Handlers para onChange dos inputs formatados ---

    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedValue = formatCep(value);
        setValue("cep", formattedValue, { shouldValidate: true });
    };

    const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedValue = formatTelefone(value);
        setValue("telefoneContato", formattedValue, { shouldValidate: true });
    };

    // Handler interno que é chamado pelo handleSubmit do react-hook-form
    const internalFormSubmitHandler: SubmitHandler<NovoAbrigoFormData> = (data) => {
        onFormSubmit(data); // Chama a função de submissão da página pai
        reset(defaultAbrigoFormValues); // Limpa o formulário para os valores padrão após o submit
    };

    return (
        <section className={className}>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Registrar Novo Abrigo</h2>
            {/* O espaçamento vertical entre os elementos do formulário foi reduzido de space-y-6 para space-y-2 */}
            <form onSubmit={handleSubmit(internalFormSubmitHandler)} className="space-y-2">
                {/* Cidade do Abrigo */}
                <div>
                    <label htmlFor="idCidade-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade do Abrigo <span className="text-red-500">*</span>
                    </label>
                    <select id="idCidade-abrigo" {...register("idCidade", { required: "Selecione uma cidade" })} className={`mt-1 block w-full px-3 py-2 border ${errors.idCidade ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} disabled={isSubmitting || todasCidades.length === 0}>
                        <option value="">{todasCidades.length === 0 ? "Nenhuma cidade disponível" : "Selecione..."}</option>
                        {todasCidades.map((cidade) => (
                            <option key={cidade.idCidade} value={cidade.idCidade.toString()}>
                                {cidade.nomeCidade}
                            </option>
                        ))}
                    </select>
                    {errors.idCidade && <p className="mt-2 text-sm text-red-600">{errors.idCidade.message}</p>}
                </div>

                {/* Nome do Abrigo */}
                <div>
                    <label htmlFor="nomeAbrigo-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Abrigo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nomeAbrigo-abrigo"
                        placeholder="Ex: Ginásio Poliesportivo Central"
                        {...register("nomeAbrigo", { required: "Nome do abrigo é obrigatório" })}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.nomeAbrigo ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.nomeAbrigo && <p className="mt-2 text-sm text-red-600">{errors.nomeAbrigo.message}</p>}
                </div>

                {/* CEP */}
                <div>
                    <label htmlFor="cep-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        CEP <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cep-abrigo"
                        placeholder="00000-000"
                        maxLength={9}
                        {...register("cep", {
                            required: "CEP é obrigatório",
                            pattern: {
                                value: /^\d{5}-\d{3}$/,
                                message: "Formato de CEP inválido (use XXXXX-XXX).",
                            },
                        })}
                        value={cepValue || ""}
                        onChange={handleCepChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.cep ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.cep && <p className="mt-2 text-sm text-red-600">{errors.cep.message}</p>}
                </div>

                {/* Endereço do Abrigo */}
                <div>
                    <label htmlFor="enderecoAbrigo-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="enderecoAbrigo-abrigo"
                        placeholder="Rua Exemplo, 123, Bairro, Cidade - UF"
                        {...register("enderecoAbrigo", { required: "Endereço é obrigatório" })}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.enderecoAbrigo ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.enderecoAbrigo && <p className="mt-2 text-sm text-red-600">{errors.enderecoAbrigo.message}</p>}
                </div>

                {/* Capacidade Máxima */}
                <div>
                    <label htmlFor="capacidadeMaxima-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Capacidade Máxima <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="capacidadeMaxima-abrigo"
                        placeholder="Ex: 150"
                        {...register("capacidadeMaxima", {
                            required: "Capacidade é obrigatória",
                            min: { value: 1, message: "Capacidade deve ser no mínimo 1" },
                            valueAsNumber: false, // Mantém como string, conversão no pai
                        })}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.capacidadeMaxima ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.capacidadeMaxima && <p className="mt-2 text-sm text-red-600">{errors.capacidadeMaxima.message}</p>}
                </div>

                {/* Telefone de Contato */}
                <div>
                    <label htmlFor="telefoneContato-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone de Contato <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel" // Use type="tel" para semântica e possível otimização mobile
                        id="telefoneContato-abrigo"
                        placeholder="(00) 00000-0000"
                        maxLength={15} // (XX) XXXXX-XXXX tem 15 caracteres
                        {...register("telefoneContato", {
                            required: "Telefone é obrigatório",
                            pattern: {
                                // Aceita (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                                value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                                message: "Formato inválido. Use (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.",
                            },
                        })}
                        value={telefoneValue || ""}
                        onChange={handleTelefoneChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.telefoneContato ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.telefoneContato && <p className="mt-2 text-sm text-red-600">{errors.telefoneContato.message}</p>}
                </div>

                {/* Status de Funcionamento */}
                <div>
                    <label htmlFor="statusFuncionamento-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Status de Funcionamento <span className="text-red-500">*</span>
                    </label>
                    <select id="statusFuncionamento-abrigo" {...register("statusFuncionamento", { required: "Selecione o status" })} className={`mt-1 block w-full px-3 py-2 border ${errors.statusFuncionamento ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} disabled={isSubmitting}>
                        {opStatusFuncionamento.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.statusFuncionamento && <p className="mt-2 text-sm text-red-600">{errors.statusFuncionamento.message}</p>}
                </div>

                {/* Nível de Segurança Atual */}
                <div>
                    <label htmlFor="nivelSegurancaAtual-abrigo" className="block text-sm font-medium text-gray-700 mb-1">
                        Nível de Segurança <span className="text-red-500">*</span>
                    </label>
                    <select id="nivelSegurancaAtual-abrigo" {...register("nivelSegurancaAtual", { required: "Selecione o nível de segurança" })} className={`mt-1 block w-full px-3 py-2 border ${errors.nivelSegurancaAtual ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} disabled={isSubmitting}>
                        {opNivelSeguranca.map((nivel) => (
                            <option key={nivel} value={nivel}>
                                {nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.nivelSegurancaAtual && <p className="mt-2 text-sm text-red-600">{errors.nivelSegurancaAtual.message}</p>}
                </div>

                {/* Botão de Submissão */}
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:opacity-75 disabled:cursor-not-allowed">
                        {isSubmitting ? "Registrando Abrigo..." : "Registrar Abrigo"}
                    </button>
                </div>
            </form>
        </section>
    );
}
