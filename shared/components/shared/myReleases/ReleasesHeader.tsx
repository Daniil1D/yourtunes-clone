"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReleaseStore } from "@/shared/store/release-store";
import { Input } from "@/shared/components/ui/input";
import { Title } from "../title";
import { createRelease } from "@/app/actions/index";
import toast from "react-hot-toast";
import { Spinner } from "../spinner";

export const ReleasesHeader = () => {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const resetRelease = useReleaseStore((s) => s.resetRelease);

  React.useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      if (value.trim()) {
        params.set("q", value);
      }

      router.push(`/releases?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, router]);

  const onCreate = async () => {
    try {
      setLoading(true);
      resetRelease(); 
      const releaseId = await createRelease();
      useReleaseStore.getState().setRelease({ id: releaseId });

      router.push(`/releases/${releaseId}/platforms`);
    } catch {
      toast.error("Не удалось создать релиз");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Title text="Мои релизы" size="2xl" className="font-bold" />

      <div className="flex items-center gap-4 bg-white h-[50px] border rounded-2xl px-5">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Поиск релиза..."
            className="pl-10"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <button
        onClick={onCreate}
        disabled={loading}
        className="
          w-full border-2 border-dashed rounded-2xl
          py-10 flex items-center justify-center gap-3
          text-xl font-semibold text-gray-600
          hover:border-black hover:text-black
          transition
        "
      >
        {loading ? <Spinner /> : <Plus className="w-6 h-6" />}
        {loading ? "Создаём релиз…" : "Новый релиз"}
      </button>
    </div>
  );
};

