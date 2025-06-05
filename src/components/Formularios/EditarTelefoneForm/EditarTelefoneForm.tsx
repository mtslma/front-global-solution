"use client";

import { EditarTelefoneFormProps, TelefoneFormData } from "@/types/types";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function EditarTelefoneForm({
    onSubmit,
    onCancel,
    isSubmitting, // Controla estado de submissão.
    initialTelefone = "", // Valor inicial para reset do campo.
    inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    errorTextClasses = "mt-1 text-xs text-red-600",
    botaoSalvarClasses = "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
    botaoCancelarClasses = "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
}: EditarTelefoneFormProps) {
    // Configura react-hook-form, usando `initialTelefone` como valor padrão.
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TelefoneFormData>({
        defaultValues: {
            novoTelefone: initialTelefone,
        },
    });

    // Reseta o campo 'novoTelefone' se a prop `initialTelefone` mudar.
    useEffect(() => {
        reset({ novoTelefone: initialTelefone });
    }, [initialTelefone, reset]);

    // Encaminha os dados validados do formulário para a função `onSubmit`.
    const handleFormSubmit: SubmitHandler<TelefoneFormData> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-2 space-y-3">
            <div>
                {/* Label acessível (sr-only) para o campo de telefone. */}
                <label htmlFor="novoTelefone" className="sr-only">
                    Novo Telefone
                </label>
                <input
                    id="novoTelefone"
                    type="tel" // Tipo 'tel' para otimizar teclado em dispositivos móveis.
                    {...register("novoTelefone", {
                        // Define regras de validação para o telefone.
                        required: "Telefone é obrigatório",
                        pattern: {
                            // Regex aprimorada para aceitar diversos formatos de telefone brasileiro,
                            // incluindo com/sem +55, com/sem DDD (em parênteses ou não),
                            // com/sem separadores (espaço ou hífen), e números diretos.
                            value: /^(?:\s*(?:\+55\s?)?(?:(?:\(\s*\d{2}\s*\))|(?:\d{2}))?\s?\d{4,5}[\s-]?\d{4}\s*|\s*\d{10,11}\s*|\s*\+55\d{10,11}\s*)$/,
                            message: "Formato inválido. Ex: +55 (XX) XXXXX-XXXX, (XX) XXXX-XXXX, XXXXXXXXXXX.",
                        },
                    })}
                    className={inputClasses}
                    placeholder="+55 (XX) XXXXX-XXXX / XXXXXXXXXXX" // Placeholder atualizado.
                    disabled={isSubmitting}
                />
                {/* Exibe mensagens de erro de validação, se houver. */}
                {errors.novoTelefone && <p className={errorTextClasses}>{errors.novoTelefone.message}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onCancel} className={botaoCancelarClasses} disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={botaoSalvarClasses}>
                    {/* Texto do botão altera para indicar submissão em progresso. */}
                    {isSubmitting ? "Salvando..." : "Salvar Telefone"}
                </button>
            </div>
        </form>
    );
}
