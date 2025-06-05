"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NovaCidadeFormData } from "@/types/types";

interface RegistrarCidadeFormProps {
    onFormSubmit: SubmitHandler<NovaCidadeFormData>;
    isSubmitting: boolean;
    className?: string;
}

const defaultFormValues: NovaCidadeFormData = {
    cep: "",
    nomeCidade: "",
};

export default function RegistrarCidadeForm({ onFormSubmit, isSubmitting, className = "lg:col-span-3 p-6 bg-white rounded-xl shadow-xl border border-gray-200" }: RegistrarCidadeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<NovaCidadeFormData>({
        defaultValues: defaultFormValues, // Utiliza os valores padrão definidos
    });

    const cepValue = watch("cep"); // Observa o valor do campo 'cep' para formatação

    // Formata o CEP (XXXXX-XXX) enquanto o usuário digita.
    const formatCep = (value: string | undefined): string => {
        if (!value) return "";
        let cleanedValue = value.replace(/\D/g, "");
        if (cleanedValue.length > 8) cleanedValue = cleanedValue.substring(0, 8);

        if (cleanedValue.length > 5) {
            return `${cleanedValue.substring(0, 5)}-${cleanedValue.substring(5)}`;
        }
        return cleanedValue;
    };

    // Atualiza o valor do CEP formatado no estado do formulário.
    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCep(event.target.value);
        setValue("cep", formattedValue, { shouldValidate: true });
    };

    // Lida com a submissão do formulário, chamando a prop e resetando os campos.
    const internalFormSubmitHandler: SubmitHandler<NovaCidadeFormData> = (data) => {
        onFormSubmit(data);
        reset(defaultFormValues);
    };

    return (
        <section className={className}>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-300 text-center">Registrar Nova Cidade</h2>
            <form onSubmit={handleSubmit(internalFormSubmitHandler)} className="space-y-4">
                {/* Campo CEP */}
                <div>
                    <label htmlFor="cep-registro" className="block text-sm font-medium text-gray-700 mb-1">
                        CEP da Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cep-registro"
                        placeholder="00000-000"
                        maxLength={9}
                        {...register("cep", {
                            required: "CEP é obrigatório",
                            pattern: {
                                value: /^\d{5}-?\d{3}$/,
                                message: "Formato de CEP inválido.",
                            },
                            validate: (value) => value?.replace(/\D/g, "").length === 8 || "CEP deve conter 8 dígitos.",
                        })}
                        value={cepValue || ""}
                        onChange={handleCepChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.cep ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.cep && <p className="mt-2 text-sm text-red-600">{errors.cep.message}</p>}
                </div>
                {/* Campo Nome da Cidade (Opcional) */}
                <div>
                    <label htmlFor="nome-cidade-registro" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Cidade <span className="text-gray-500 text-xs">(Opcional)</span>
                    </label>
                    <input
                        type="text"
                        id="nome-cidade-registro"
                        placeholder="Ex: São Paulo"
                        {...register("nomeCidade")} // Campo opcional, sem validação de 'required'
                        className={`mt-1 block w-full px-3 py-2 border ${errors.nomeCidade ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        disabled={isSubmitting}
                    />
                    {/* Mensagem de erro para 'nome' seria exibida aqui se houvesse validações */}
                </div>
                {/* Botão de Submissão */}
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:opacity-75 disabled:cursor-not-allowed">
                        {isSubmitting ? "Registrando..." : "Registrar Cidade"}
                    </button>
                </div>
            </form>
        </section>
    );
}
