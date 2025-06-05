"use client";

import { EditarEmailFormProps, EmailFormData } from "@/types/types";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function EditarEmailForm({
    onSubmit,
    onCancel,
    isSubmitting,
    initialNovoEmail = "", // Valor inicial para o campo, usado para resetar.
    inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    errorTextClasses = "mt-1 text-xs text-red-600",
    botaoSalvarClasses = "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
    botaoCancelarClasses = "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
}: EditarEmailFormProps) {
    // Configuração do react-hook-form com valor inicial para 'novoEmail'.
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EmailFormData>({
        defaultValues: {
            novoEmail: initialNovoEmail,
        },
    });

    // Reseta o campo 'novoEmail' se o valor inicial (prop) mudar.
    useEffect(() => {
        reset({ novoEmail: initialNovoEmail });
    }, [initialNovoEmail, reset]);

    // Encaminha os dados do formulário para a função onSubmit fornecida.
    const handleFormSubmit: SubmitHandler<EmailFormData> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-2 space-y-3">
            <div>
                {/* Label acessível para leitores de tela. */}
                <label htmlFor="novoEmailInput" className="sr-only">
                    Novo E-mail
                </label>
                <input
                    id="novoEmailInput"
                    type="email"
                    {...register("novoEmail", {
                        // Define validações para o campo.
                        required: "E-mail é obrigatório",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Formato de e-mail inválido",
                        },
                    })}
                    className={inputClasses}
                    placeholder="Digite o novo e-mail"
                    disabled={isSubmitting} // Desabilita durante a submissão.
                />
                {/* Exibe erros de validação para o campo. */}
                {errors.novoEmail && <p className={errorTextClasses}>{errors.novoEmail.message}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onCancel} className={botaoCancelarClasses} disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={botaoSalvarClasses}>
                    {/* Texto dinâmico no botão de salvar. */}
                    {isSubmitting ? "Salvando..." : "Salvar E-mail"}
                </button>
            </div>
        </form>
    );
}
