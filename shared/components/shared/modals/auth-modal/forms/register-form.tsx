"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerUser } from "@/app/actions";
import { TFormRegisterValues, formRegisterSchema } from "./schemas";
import { FormInput } from "../../../form";
import { Button } from "@/shared/components/ui";
import { Spinner } from "../../../spinner";

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose, onClickLogin }) => {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      setLoading(true);
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.success("Регистрация успешна", {
        icon: "✅",
      });

      onClose?.();
    } catch (error) {
      toast.error("Неверный E-Mail или пароль", {
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="fullName" label="Полное имя" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <FormInput
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          required
        />

        <Button className="h-12 text-base" type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
        </Button>
      </form>
    </FormProvider>
  );
};
