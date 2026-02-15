"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";

interface Props {
  platforms: {
    id: string;
    name: string;
  }[];
  name: string;
}

export const PlatformsDropdown = ({ platforms, name }: Props) => {
  const { watch, setValue } = useFormContext();

  const selected: string[] = watch(name) || [];

  const toggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];

    setValue(name, updated, { shouldValidate: true });
  };

  return (
    <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
      <h3 className="font-semibold">Площадки релиза</h3>

      <div className="max-h-[250px] overflow-y-auto space-y-2">
        {platforms.map((p) => {
          const active = selected.includes(p.id);

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 rounded-lg border text-left",
                active
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              )}
            >
              {active ? <Check size={18} /> : <span className="w-[18px]" />}
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
