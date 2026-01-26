import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TFormLoginValues, formLoginSchema } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "../../../title";
import { FormInput } from "../../../form/form-input";
import { Button } from "@/shared/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Spinner } from "../../../spinner";

interface Props {
  onClose?: VoidFunction;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      setLoading(true);
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        throw Error();
      }

      toast.success("Вы успешно вошли в аккаунт", {
        icon: "✅",
      });

      onClose?.();
    } catch (error) {
      console.error("Error [LOGIN]", error);
      toast.error("Не удалось войти в аккаунт", {
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
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title text="Вход в аккаунт" size="md" className="font-bold" />
            <p className="text-gray-400">
              Введите свою почту, чтобы войти в свой аккаунт
            </p>
          </div>
        </div>

        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Пароль" type="password" required />

        <Button className="h-12 text-base" type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Входим…" : "Войти"}
        </Button>
      </form>
    </FormProvider>
  );
};
