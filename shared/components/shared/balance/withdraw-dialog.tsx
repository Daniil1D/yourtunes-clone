"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui";

import { Button, Input } from "@/shared/components/ui";
import { withdrawBalance } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const WithdrawDialog = ({ open, setOpen }: Props) => {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    try {
      const value = Number(amount);

      await withdrawBalance(value);

      toast.success("Вывод успешно выполнен 💸");

      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Ошибка вывода");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-xl rounded-3xl p-10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-bold">
            Вывести средства
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="mt-6 space-y-2">
          <p className="font-medium">Сумма вывода</p>

          <Input
            placeholder="Введите сумму ₽"
            className="h-14 text-lg rounded-2xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button
          className="mt-8 h-14 rounded-2xl text-lg w-full"
          onClick={onSubmit}
        >
          Вывести
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
