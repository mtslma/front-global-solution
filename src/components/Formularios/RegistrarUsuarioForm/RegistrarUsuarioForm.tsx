// src/components/Formularios/RegistroForm/RegistroForm.tsx
"use client";

import React, { ChangeEvent } from "react"; // Importado ChangeEvent
import { useForm, SubmitHandler } from "react-hook-form";
import { CreateUsuario, Cidade } from "@/types/types";

export type RegistroFormData = Omit<CreateUsuario, "tipoUsuario" | "autenticaUsuario" | "idCidade"> & {
    emailUsuario: string;
    senhaUsuario: string;
    confirmarSenhaUsuario: string;
    idCidade: string;
    // telefoneContato já está em CreateUsuario e será string aqui
};

interface RegistroFormProps {
    onSubmit: SubmitHandler<RegistroFormData>;
    isSubmitting: boolean;
    listaCidades: Cidade[];
    inputBaseClasses: string;
    inputErrorClasses: string;
    inputValidClasses: string;
    errorTextClasses: string;
    buttonClasses: string;
    formSpacingClasses?: string;
}

export default function RegistroForm({ onSubmit, isSubmitting, listaCidades, inputBaseClasses, inputErrorClasses, inputValidClasses, errorTextClasses, buttonClasses, formSpacingClasses = "space-y-3 md:space-y-4" }: RegistroFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue, // Adicionado setValue para controlar o input programaticamente
        // reset, // O reset é chamado no componente pai (LoginPage)
    } = useForm<RegistroFormData>();

    const handleFormSubmit: SubmitHandler<RegistroFormData> = (data) => {
        // Antes de submeter, podemos re-limpar o telefone para enviar apenas números se a API preferir
        // Mas como a validação pattern já aceita o formato com máscara, vamos enviar como está no form.
        // Se a API espera apenas números: data.telefoneContato = data.telefoneContato.replace(/\D/g, '');
        onSubmit(data);
    };

    // Função para formatar número de telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const formatAndSetTelefone = (value: string) => {
        let cleaned = value.replace(/\D/g, ""); // Remove tudo que não é dígito

        // Limita a 11 dígitos (máximo para celular com DDD)
        if (cleaned.length > 11) {
            cleaned = cleaned.substring(0, 11);
        }

        let formattedValue = "";
        if (cleaned.length > 0) {
            formattedValue = "(" + cleaned.substring(0, 2); // Adiciona parênteses no DDD
        }
        if (cleaned.length > 2) {
            formattedValue += ") "; // Fecha parênteses e adiciona espaço
            // Verifica se é celular (11 dígitos) ou fixo (10 dígitos) para o hífen
            if (cleaned.length <= 10) {
                // Fixo (XX) XXXX-XXXX
                formattedValue += cleaned.substring(2, 6);
                if (cleaned.length > 6) {
                    formattedValue += "-" + cleaned.substring(6, 10);
                }
            } else {
                // Celular (XX) XXXXX-XXXX
                formattedValue += cleaned.substring(2, 7);
                if (cleaned.length > 7) {
                    formattedValue += "-" + cleaned.substring(7, 11);
                }
            }
        }

        setValue("telefoneContato", formattedValue, { shouldValidate: true, shouldDirty: true });
    };

    const handleTelefoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        formatAndSetTelefone(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={formSpacingClasses}>
            {/* Campo Nome Completo */}
            <div>
                <label htmlFor="reg-nomeUsuario" className="block text-sm font-medium text-gray-700">
                    Nome Completo:
                </label>
                <input id="reg-nomeUsuario" maxLength={60} type="text" {...register("nomeUsuario", { required: "Nome é obrigatório" })} placeholder="Seu nome completo" className={`${inputBaseClasses} ${errors.nomeUsuario ? inputErrorClasses : inputValidClasses}`} disabled={isSubmitting} />
                {errors.nomeUsuario && <span className={errorTextClasses}>{errors.nomeUsuario.message}</span>}
            </div>
            {/* Campo Email */}
            <div>
                <label htmlFor="reg-emailUsuario" className="block text-sm font-medium text-gray-700">
                    Email:
                </label>
                <input
                    id="reg-emailUsuario"
                    type="email"
                    {...register("emailUsuario", {
                        required: "Email é obrigatório",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
                    })}
                    placeholder="seu.email@exemplo.com"
                    className={`${inputBaseClasses} ${errors.emailUsuario ? inputErrorClasses : inputValidClasses}`}
                    disabled={isSubmitting}
                />
                {errors.emailUsuario && <span className={errorTextClasses}>{errors.emailUsuario.message}</span>}
            </div>
            {/* Campo Senha */}
            <div>
                <label htmlFor="reg-senhaUsuario" className="block text-sm font-medium text-gray-700">
                    Senha:
                </label>
                <input
                    id="reg-senhaUsuario"
                    type="password"
                    {...register("senhaUsuario", {
                        required: "Senha é obrigatória",
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        maxLength: { value: 30, message: "Máximo 30 caracteres" },
                    })}
                    placeholder="Crie uma senha"
                    className={`${inputBaseClasses} ${errors.senhaUsuario ? inputErrorClasses : inputValidClasses}`}
                    disabled={isSubmitting}
                />
                {errors.senhaUsuario && <span className={errorTextClasses}>{errors.senhaUsuario.message}</span>}
            </div>
            {/* Campo Confirmar Senha */}
            <div>
                <label htmlFor="reg-confirmarSenhaUsuario" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha:
                </label>
                <input
                    id="reg-confirmarSenhaUsuario"
                    type="password"
                    {...register("confirmarSenhaUsuario", {
                        required: "Confirmação é obrigatória",
                        validate: (value) => value === watch("senhaUsuario") || "As senhas não coincidem",
                    })}
                    placeholder="Confirme sua senha"
                    className={`${inputBaseClasses} ${errors.confirmarSenhaUsuario ? inputErrorClasses : inputValidClasses}`}
                    disabled={isSubmitting}
                />
                {errors.confirmarSenhaUsuario && <span className={errorTextClasses}>{errors.confirmarSenhaUsuario.message}</span>}
            </div>
            {/* Campo Telefone COM FORMATAÇÃO */}
            <div>
                <label htmlFor="reg-telefoneContato" className="block text-sm font-medium text-gray-700">
                    Telefone:
                </label>
                <input
                    id="reg-telefoneContato"
                    type="tel" // type="tel" é mais apropriado
                    maxLength={15} // (XX) XXXXX-XXXX -> 10 (digitos) + 2 (parenteses) + 1 (espaço) + 1 (hífen) = 14, ou 15 com 9º digito
                    {...register("telefoneContato", {
                        required: "Telefone é obrigatório",
                        // A validação de pattern pode ser mais simples agora, focando no formato final
                        // ou validar a quantidade de dígitos após limpar a máscara no submit se necessário
                        pattern: {
                            value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, // Valida o formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
                            message: "Telefone inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.",
                        },
                    })}
                    placeholder="(XX) XXXXX-XXXX"
                    onChange={handleTelefoneChange} // Chama a função de formatação no onChange
                    // value={telefoneValue || ""} // O value é controlado pelo react-hook-form através do register
                    className={`${inputBaseClasses} ${errors.telefoneContato ? inputErrorClasses : inputValidClasses}`}
                    disabled={isSubmitting}
                />
                {errors.telefoneContato && <span className={errorTextClasses}>{errors.telefoneContato.message}</span>}
            </div>
            {/* Campo Cidade */}
            <div>
                <label htmlFor="reg-idCidade" className="block text-sm font-medium text-gray-700">
                    Cidade:
                </label>
                <select id="reg-idCidade" {...register("idCidade", { required: "Cidade é obrigatória" })} className={`${inputBaseClasses} ${errors.idCidade ? inputErrorClasses : inputValidClasses}`} defaultValue="" disabled={isSubmitting || listaCidades.length === 0}>
                    <option value="" disabled>
                        {listaCidades.length === 0 && !isSubmitting ? "Carregando cidades..." : "Selecione sua cidade"}
                    </option>
                    {listaCidades.map((cidade) => (
                        <option key={cidade.idCidade} value={String(cidade.idCidade)}>
                            {cidade.nomeCidade}
                        </option>
                    ))}
                </select>
                {errors.idCidade && <span className={errorTextClasses}>{errors.idCidade.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className={buttonClasses}>
                {isSubmitting ? "Registrando..." : "Criar Conta"}
            </button>
        </form>
    );
}
