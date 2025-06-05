// src/components/EditarCepForm/EditarCepForm.tsx
"use client";

import { CepFormData, EditarCepFormProps } from "@/types/types";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function EditarCepForm({
    onSubmit,
    onCancel,
    isSubmitting,
    initialNovoCep = "",
    inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    errorTextClasses = "mt-1 text-xs text-red-600",
    botaoSalvarClasses = "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
    botaoCancelarClasses = "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
}: EditarCepFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CepFormData>({
        defaultValues: {
            novoCep: initialNovoCep,
        },
    });

    // Observa o valor do campo 'novoCep' para formatação
    const cepValue = watch("novoCep");

    // Efeito para resetar o formulário se o valor inicial mudar
    useEffect(() => {
        reset({ novoCep: formatCep(initialNovoCep) }); // Formata o valor inicial também
    }, [initialNovoCep, reset]);

    // Função para formatar o CEP (XXXXX-XXX)
    const formatCep = (value: string | undefined): string => {
        if (!value) return "";
        let cleanedValue = value.replace(/\D/g, ""); // Remove não numéricos
        if (cleanedValue.length > 8) {
            cleanedValue = cleanedValue.substring(0, 8); // Limita a 8 dígitos
        }
        if (cleanedValue.length > 5) {
            return `${cleanedValue.substring(0, 5)}-${cleanedValue.substring(5)}`;
        }
        return cleanedValue;
    };

    // Handler para o evento onChange do input do CEP
    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedValue = formatCep(value);
        setValue("novoCep", formattedValue, { shouldValidate: true }); // Atualiza o valor no react-hook-form e valida
    };

    // A função onSubmit da prop será chamada aqui
    const handleFormSubmit: SubmitHandler<CepFormData> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-2 space-y-3">
            <div>
                <label htmlFor="novoCepInput" className="block text-sm font-medium text-gray-700">
                    {/* Label visível para clareza, em vez de sr-only */}
                    Novo CEP
                </label>
                <input
                    id="novoCepInput"
                    type="text" // Use text para permitir a formatação com "-"
                    maxLength={9} // XXXXX-XXX
                    {...register("novoCep", {
                        required: "CEP é obrigatório",
                        pattern: {
                            value: /^\d{5}-\d{3}$/,
                            message: "Formato de CEP inválido (Ex: 00000-000)",
                        },
                    })}
                    value={cepValue || ""} // Controla o valor do input para exibir o valor formatado
                    onChange={handleCepChange} // Aplica a formatação ao digitar
                    className={inputClasses}
                    placeholder="Digite o novo CEP"
                    disabled={isSubmitting}
                />
                {errors.novoCep && <p className={errorTextClasses}>{errors.novoCep.message}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onCancel} className={botaoCancelarClasses} disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={botaoSalvarClasses}>
                    {isSubmitting ? "Salvando..." : "Salvar CEP"}
                </button>
            </div>
        </form>
    );
}
