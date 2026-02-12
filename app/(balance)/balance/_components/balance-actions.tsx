"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui";
import { TopUpDialog } from "@/shared/components/shared/balance/topup-dialog";

export function BalanceActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Button
        variant="secondary"
        className="rounded-2xl px-6 h-12"
        onClick={() => setOpen(true)}
      >
        + Пополнить
      </Button>

      <Button variant="secondary" className="rounded-2xl px-6 h-12">
        ↑ Вывести
      </Button>

      <TopUpDialog open={open} setOpen={setOpen} />
    </div>
  );
}
