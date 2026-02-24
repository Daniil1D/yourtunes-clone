"use client";

import React from "react";
import { User } from "@prisma/client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

import {
  formRegisterSchema,
  TFormRegisterValues,
} from "../modals/auth-modal/forms/schemas";

import { FormInput } from "../form";
import { Button } from "@/shared/components/ui";
import { updateUserInfo } from "@/app/actions/index";

interface Props {
  user: User;
  setIsEditing: (value: boolean) => void;
}

export function ProfileEditForm({ user, setIsEditing }: Props) {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: TFormRegisterValues) => {
    try {
      await updateUserInfo({
        email: values.email,
        fullName: values.fullName,
        password: values.password,
      });

      toast.success("Данные обновлены 📝");
      setIsEditing(false);
    } catch {
      toast.error("Ошибка при обновлении ❌");
    }
  };

  const onClickSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" profile-form mt-10 p-10  bg-white rounded-xl  shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput name="email" label="E-Mail" required />
          <FormInput name="fullName" label="Имя" required />

          <FormInput
            type="password"
            name="password"
            label="Новый пароль"
            required
          />
          <FormInput
            type="password"
            name="confirmPassword"
            label="Повторите пароль"
            required
          />
        </div>

        <div className="profile-form__actions flex justify-center gap-4 mt-10">
          <Button
            disabled={form.formState.isSubmitting}
            className="text-base min-w-[180px]"
            type="submit"
          >
            Сохранить
          </Button>

          <Button
            onClick={onClickSignOut}
            variant="secondary"
            disabled={form.formState.isSubmitting}
            className="text-base min-w-[180px]"
            type="button"
          >
            Выйти
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
