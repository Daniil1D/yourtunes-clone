"use client";

import { FormInput } from "@/shared/components/shared/form/form-input";
import { Info } from "lucide-react";

export const ReleaseCopyrightForm = () => {
  return (
    <div className="rounded-3xl border bg-white shadow-sm p-8 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Авторское право</h2>

        <div className="relative group">
          <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          <div className="absolute left-1/2 -translate-x-1/2 top-6 hidden group-hover:block
            w-64 text-xs bg-black text-white p-3 rounded-lg">
            Укажите ФИО правообладателей. Если их несколько — через запятую.
          </div>
        </div>
      </div>

      <FormInput
        name="copyright"
        placeholder="ФИО правообладателя"
      />
    </div>
  );
};
