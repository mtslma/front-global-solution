// Supondo que este arquivo esteja em: src/components/OcorrenciasPageSecoes/RegistrarOcorrenciaForm.tsx
// ou similar, ajuste o caminho da importação de Cidade se necessário.
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Cidade, NovaOcorrenciaFormData } from "@/types/types";

// Opções para os selects de Ocorrência
const opTipoOcorrencia = ["ENCHENTE", "ALAGAMENTO", "DESLIZAMENTO", "QUEIMADA"];
const opNivelGravidade = ["BAIXO", "MÉDIO", "ALTO"];

interface RegistrarOcorrenciaFormProps {
    onFormSubmit: SubmitHandler<NovaOcorrenciaFormData>;
    isSubmitting: boolean;
    todasCidades: Cidade[];
    className?: string;
}

// Valores padrão para o formulário, para uso no useForm e no reset
const defaultOcorrenciaFormValues: NovaOcorrenciaFormData = {
    cep: "",
    tipoOcorrencia: "ENCHENTE",
    nivelGravidade: "BAIXO",
    idCidade: "",
};

export default function RegistrarOcorrenciaForm({
    onFormSubmit,
    isSubmitting,
    todasCidades,
    className = "lg:col-span-3 p-6 bg-white rounded-xl shadow-xl border border-gray-200", // Classes default para o card
}: RegistrarOcorrenciaFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<NovaOcorrenciaFormData>({
        defaultValues: defaultOcorrenciaFormValues,
    });

    // Observa o valor do campo CEP para formatação manual
    const cepValue = watch("cep");

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

    // Handlers

    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedValue = formatCep(value);
        setValue("cep", formattedValue, { shouldValidate: true });
    };

    // Handler interno que é chamado pelo handleSubmit do react-hook-form
    const internalFormSubmitHandler: SubmitHandler<NovaOcorrenciaFormData> = (data) => {
        console.log("Dados DENTRO do RegistrarOcorrenciaForm:", data);
        onFormSubmit(data);
        reset(defaultOcorrenciaFormValues);
    };

    return (
        <section className={className}>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Registrar Nova Ocorrência</h2>
            <form onSubmit={handleSubmit(internalFormSubmitHandler)} className="space-y-4">
                {/* Cidade da Ocorrência */}
                <div>
                    <label htmlFor="idCidade-ocorrencia" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade da Ocorrência <span className="text-red-500">*</span>
                    </label>
                    <select id="idCidade-ocorrencia" {...register("idCidade", { required: "Selecione uma cidade" })} className={`mt-1 block w-full px-3 py-2 border ${errors.idCidade ? "border-indigo-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} disabled={isSubmitting || todasCidades.length === 0}>
                        <option value="">{todasCidades.length === 0 ? "Nenhuma cidade disponível" : "Selecione..."}</option>
                        {todasCidades.map((cidade) => (
                            <option key={cidade.idCidade} value={cidade.idCidade.toString()}>
                                {cidade.nomeCidade}
                            </option>
                        ))}
                    </select>
                    {errors.idCidade && <p className="mt-2 text-sm text-red-600">{errors.idCidade.message}</p>}
                </div>
                {/* Tipo da Ocorrência */}
                <div>
                    <label htmlFor="tipoOcorrencia-ocorrencia" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo da Ocorrência <span className="text-red-500">*</span>
                    </label>
                    <select id="tipoOcorrencia-ocorrencia" {...register("tipoOcorrencia", { required: "Selecione o tipo da ocorrência" })} className={`mt-1 block w-full px-3 py-2 border ${errors.tipoOcorrencia ? "border-indigo-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} disabled={isSubmitting}>
                        {opTipoOcorrencia.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.tipoOcorrencia && <p className="mt-2 text-sm text-red-600">{errors.tipoOcorrencia.message}</p>}
                </div>
                {/* Nível de Gravidade */}
                <div>
                    <label htmlFor="nivelGravidade-ocorrencia" className="block text-sm font-medium text-gray-700 mb-1">
                        Nível de Gravidade <span className="text-red-500">*</span>
                    </label>
                    <select id="nivelGravidade-ocorrencia" {...register("nivelGravidade", { required: "Selecione o nível de gravidade" })} className={`mt-1 block w-full px-3 py-2 border ${errors.nivelGravidade ? "border-indigo-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} disabled={isSubmitting}>
                        {opNivelGravidade.map((nivel) => (
                            <option key={nivel} value={nivel}>
                                {nivel.charAt(0).toUpperCase() + nivel.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    {errors.nivelGravidade && <p className="mt-2 text-sm text-red-600">{errors.nivelGravidade.message}</p>}
                </div>
                {/* CEP da Ocorrência */}
                <div>
                    <label htmlFor="cep-ocorrencia" className="block text-sm font-medium text-gray-700 mb-1">
                        CEP (Local da Ocorrência) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cep-ocorrencia"
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
                        className={`mt-1 block w-full px-3 py-2 border ${errors.cep ? "border-indigo-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.cep && <p className="mt-2 text-sm text-red-600">{errors.cep.message}</p>}
                </div>
                {/* Botão de Submissão */}
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:opacity-75 disabled:cursor-not-allowed">
                        {isSubmitting ? "Registrando Ocorrência..." : "Registrar Ocorrência"}
                    </button>
                </div>
            </form>
        </section>
    );
}
