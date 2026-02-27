"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { registerUser } from "@/app/actions/index";
import { TFormRegisterValues, formRegisterSchema } from "./schemas";

import { FormInput } from "@/shared/components/shared/form/form-input";
import { Button } from "@/shared/components/ui";
import { Spinner } from "@/shared/components/shared/spinner";

import { PUBLIC_OFFER_TEXT, PUBLIC_OFFER_TEXT2, PUBLIC_OFFER_TEXT3 } from "@/shared/contants/public-offer";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui";

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = React.useState(false);

  const [agreeOffer, setAgreeOffer] = React.useState(false);
  const [agreePersonal, setAgreePersonal] = React.useState(false);
  const [agreeAds, setAgreeAds] = React.useState(false);

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
    if (!agreeOffer || !agreePersonal || !agreeAds) {
      toast.error("Необходимо принять все соглашения", {
        icon: "⚠️",
      });
      return;
    }

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
      toast.error("Ошибка регистрации", {
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
        {/* поля */}
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="fullName" label="Полное имя" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <FormInput
          name="confirmPassword"
          label="Подтвердите пароль"
          type="password"
          required
        />

        <div className="flex flex-col gap-3 text-sm text-gray-600">

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeOffer}
              onChange={(e) => setAgreeOffer(e.target.checked)}
              className="mt-1"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  Я ознакомлен(а) и соглашаюсь с договором публичной оферты
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ДОГОВОР ПУБЛИЧНОЙ ОФЕРТЫ
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {PUBLIC_OFFER_TEXT}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Закрыть</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => setAgreeOffer(true)}
                  >
                    Согласен(а)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreePersonal}
              onChange={(e) => setAgreePersonal(e.target.checked)}
              className="mt-1"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  Я предоставляю согласие на обработку персональных данных
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ДОГОВОР ПУБЛИЧНОЙ ОФЕРТЫ
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                       {PUBLIC_OFFER_TEXT2}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Закрыть</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => setAgreePersonal(true)}
                  >
                    Согласен(а)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeAds}
              onChange={(e) => setAgreeAds(e.target.checked)}
              className="mt-1"
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  Я предоставляю согласие на получение рекламных и информационных сообщений
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ДОГОВОР ПУБЛИЧНОЙ ОФЕРТЫ
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                       {PUBLIC_OFFER_TEXT3}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Закрыть</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => setAgreeAds(true)}
                  >
                    Согласен(а)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Button className="h-12 text-base" type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
        </Button>
      </form>
    </FormProvider>
  );
};
