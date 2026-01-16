'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TFormRegisterValues, formRegisterSchema } from './modals/auth-modal/forms/schemas';
import { User } from '@prisma/client';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { Container } from './container';
import { Title } from './title';
import { FormInput } from './form';
import { Button } from '../ui';
import { updateUserInfo } from '@/app/actions';

interface Props {
  data: User;
}

export const ProfileForm: React.FC<Props> = ({ data }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.success('Данные обновлены 📝');
    } catch {
      toast.error('Ошибка при обновлении данных ❌');
    }
  };

  const onClickSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Container className="my-10">
      <Title text="Личные данные" size="md" className="font-bold" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" profile-form mt-10 p-10  bg-white rounded-xl  shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="email" label="E-Mail" required />
              <FormInput name="fullName" label="Имя" required />

              <FormInput type="password" name="password" label="Новый пароль" required/>
              <FormInput type="password" name="confirmPassword" label="Повторите пароль" required/>
          </div>


          <div
            className="profile-form__actions flex justify-center gap-4 mt-10">
            <Button disabled={form.formState.isSubmitting} className="text-base min-w-[180px]" type="submit">
              Сохранить
            </Button>

            <Button onClick={onClickSignOut} variant="secondary" disabled={form.formState.isSubmitting} className="text-base min-w-[180px]" type="button">
              Выйти
            </Button>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};
