"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormInput } from "@/shared/components/shared/form/form-input";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export const ReleasePublishDateForm = () => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-3xl border bg-white shadow-sm p-8 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Дата публикации</h2>
        <p className="text-sm text-gray-500">Выберите дату</p>
      </div>

      <Controller
        name="publishDate"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <FormInput
              name={field.name}
              placeholder="Выберите дату"
              value={field.value ? format(field.value, "dd.MM.yyyy") : ""}
              onClick={() => setOpen(true)}
              readOnly
              rightSlot={
                <CalendarIcon
                  className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => setOpen(prev => !prev)}
                />
              }
            />

            {open && (
              <div
                className="absolute z-50 mt-2 rounded-2xl border bg-white shadow-xl p-4"
                onMouseLeave={() => setOpen(false)}
              >
                <DayPicker
                  mode="single"
                  selected={field.value ?? undefined}
                  onSelect={(date) => {
                    field.onChange(date ?? null);
                    setOpen(false);
                  }}
                  disabled={{ before: new Date() }}
                />
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};
