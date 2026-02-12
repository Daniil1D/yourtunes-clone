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
import { createBalanceTopUp } from "@/app/actions";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function TopUpDialog({ open, setOpen }: Props) {
    const [amount, setAmount] = useState("");

    const onSubmit = async () => {
        try {
        const value = Number(amount);

        const url = await createBalanceTopUp(value);

        toast.success("Переходим к оплате...");

        setOpen(false);

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

        <div className="flex justify-between mt-6 text-lg font-medium">
          <button className="w-1/2 text-center border-b-2 border-black pb-2">
            Оплата из РФ
          </button>

          <button className="w-1/2 text-center text-gray-400 pb-2">
            Оплата не из РФ
          </button>
        </div>

        <div className="mt-8 space-y-4">
          <p className="font-semibold text-lg">Способ оплаты</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-2xl p-5 space-y-3 cursor-pointer">
              <p className="font-medium">Новой картой</p>
              <p className="text-gray-400 text-sm">
                Мир, Visa, MasterCard
              </p>
            </div>

            <div className="border rounded-2xl p-5 space-y-3 cursor-pointer">
              <p className="font-medium">СБП</p>
              <p className="text-gray-400 text-sm">
                Мир, Visa, MasterCard
              </p>
            </div>
          </div>
        </div>

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
