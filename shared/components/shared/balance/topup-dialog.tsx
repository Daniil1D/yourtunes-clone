"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/shared/components/ui";

import { Button, Input } from "@/shared/components/ui";
import { createBalanceTopUp } from "@/app/actions/index";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const TopUpDialog = ({ open, setOpen }: Props) => {
    const [amount, setAmount] = useState("");

    const onSubmit = async () => {
        try {
        const value = Number(amount);

        const url = await createBalanceTopUp(value);
        
        toast.success("Переходим к оплате...");

        window.location.href = url;
        } catch (e) {
          toast.error("Ошибка пополнения");
        }
    };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogOverlay className="fixed inset-0 bg-black/40" />
      <AlertDialogContent className="max-w-3xl rounded-3xl p-10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-4xl font-bold">
            Пополнить
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="mt-8 space-y-2">
          <p className="font-semibold text-lg">Сумма пополнения</p>

          <Input
            placeholder="Введите сумму ₽"
            className="h-14 text-lg rounded-2xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button className="mt-8 h-14 rounded-2xl text-lg w-40" onClick={onSubmit}>
          Пополнить
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
