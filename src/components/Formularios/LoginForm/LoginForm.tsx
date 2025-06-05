"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginBody, LoginFormProps } from "@/types/types"; // Certifique-se que o caminho está correto


export default function LoginForm({
    onSubmit,
    isSubmitting,
    inputBaseClasses,
    inputErrorClasses,
    inputValidClasses,
    errorTextClasses,
    buttonClasses,
    formSpacingClasses = "space-y-5 md:space-y-6", // Valor default para o espaçamento
}: LoginFormProps) {
    const {
        register, // Renomeado de registerLogin para uso local
        handleSubmit,
        formState: { errors }, // Renomeado de errorsLogin
    } = useForm<loginBody>();

    // A função onSubmit da prop (vinda de LoginPage) será chamada aqui
    // pelo handleSubmit do react-hook-form.
    const handleFormSubmit: SubmitHandler<loginBody> = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={formSpacingClasses}>
            <div>
                <label htmlFor="login-emailUsuario" className="block text-sm font-medium text-gray-700">
                    Email:
                </label>
                <input
                    id="login-emailUsuario" // Adicionado prefixo para garantir ID único
                    type="email"
                    {...register("emailUsuario", {
                        required: "O campo email é obrigatório.",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Digite um email válido." },
                    })}
                    placeholder="seu.email@exemplo.com"
                    className={`${inputBaseClasses} ${errors.emailUsuario ? inputErrorClasses : inputValidClasses}`}
                    disabled={isSubmitting}
                />
                {errors.emailUsuario && <span className={errorTextClasses}>{errors.emailUsuario.message}</span>}
            </div>
            <div>
                <label htmlFor="login-senhaUsuario" className="block text-sm font-medium text-gray-700">
                    Senha:
                </label>
                <input
                    id="login-senhaUsuario" // Adicionado prefixo para garantir ID único
                    type="password"
                    {...register("senhaUsuario", { required: "O campo senha é obrigatório." })}
                    placeholder="Digite sua senha..."
                    className={`${inputBaseClasses} ${errors.senhaUsuario ? inputErrorClasses : inputValidClasses}`}
                    disabled={isSubmitting}
                />
                {errors.senhaUsuario && <span className={errorTextClasses}>{errors.senhaUsuario.message}</span>}
            </div>
            <button type="submit" disabled={isSubmitting} className={buttonClasses}>
                {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
        </form>
    );
}
