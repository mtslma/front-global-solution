"use client";

import { EditarSenhaFormProps, SenhaFormData } from "@/types/types";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function EditarSenhaForm({
    onSubmit,
    onCancel,
    isSubmitting, // Controla o estado de submissão, desabilitando inputs/botões.
    // Classes CSS padrão, podem ser sobrescritas via props.
    inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    errorTextClasses = "mt-1 text-xs text-red-600",
    botaoSalvarClasses = "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
    botaoCancelarClasses = "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
}: EditarSenhaFormProps) {
    // Configuração do react-hook-form, incluindo 'watch' para validação de confirmação de senha.
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<SenhaFormData>({
        defaultValues: {
            // Campos de senha iniciam vazios por segurança e usabilidade.
            novaSenha: "",
            confirmarNovaSenha: "",
        },
    });

    // Efeito para limpar os campos de senha ao montar o formulário.
    useEffect(() => {
        reset({
            novaSenha: "",
            confirmarNovaSenha: "",
        });
    }, [reset]); // Dependência `reset` garante que o efeito execute conforme esperado.

    // Encaminha os dados do formulário para a função onSubmit fornecida.
    const handleFormSubmit: SubmitHandler<SenhaFormData> = (data) => {
        onSubmit(data);
    };

    // Observa o valor do campo 'novaSenha' para usar na validação de 'confirmarNovaSenha'.
    const watchedNovaSenha = watch("novaSenha");

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
            <p className="text-gray-700 text-sm sm:text-base font-semibold">Alteração da senha de acesso</p>
            <div>
                {/* Label acessível para leitores de tela. */}
                <label htmlFor="novaSenha" className="sr-only">
                    Nova Senha
                </label>
                <input
                    id="novaSenha"
                    type="password"
                    {...register("novaSenha", {
                        // Define validações para o campo nova senha.
                        required: "Nova senha é obrigatória",
                        minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres" },
                        maxLength: { value: 30, message: "A senha deve ter no máximo 30 caracteres" },
                    })}
                    className={inputClasses}
                    placeholder="Nova Senha (mín. 8 caracteres)"
                    disabled={isSubmitting}
                />
                {/* Exibe erros de validação para o campo nova senha. */}
                {errors.novaSenha && <p className={errorTextClasses}>{errors.novaSenha.message}</p>}
            </div>
            <div>
                {/* Label acessível para leitores de tela. */}
                <label htmlFor="confirmarNovaSenha" className="sr-only">
                    Confirmar Nova Senha
                </label>
                <input
                    id="confirmarNovaSenha"
                    type="password"
                    {...register("confirmarNovaSenha", {
                        // Define validações para o campo de confirmação.
                        required: "Confirmação de senha é obrigatória",
                        validate: (value) => value === watchedNovaSenha || "As senhas não coincidem", // Validação customizada para verificar se as senhas são iguais.
                    })}
                    className={inputClasses}
                    placeholder="Confirmar Nova Senha"
                    disabled={isSubmitting}
                />
                {/* Exibe erros de validação para o campo de confirmação. */}
                {errors.confirmarNovaSenha && <p className={errorTextClasses}>{errors.confirmarNovaSenha.message}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onCancel} className={botaoCancelarClasses} disabled={isSubmitting}>
                    Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={botaoSalvarClasses}>
                    {/* Texto dinâmico no botão de salvar. */}
                    {isSubmitting ? "Salvando..." : "Salvar Senha"}
                </button>
            </div>
        </form>
    );
}
