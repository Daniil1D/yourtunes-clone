"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui";
import { TopUpDialog } from "@/shared/components/shared/balance/topup-dialog";
import { WithdrawDialog } from "@/shared/components/shared/balance/withdraw-dialog";

export function BalanceActions() {
  const [openTopUp, setOpenTopUp] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  return (
    <div className="flex gap-4">
      <Button
        variant="secondary"
        className="rounded-2xl px-6 h-12"
        onClick={() => setOpenTopUp(true)}
      >
        + Пополнить
      </Button>

      <Button
        variant="secondary"
        className="rounded-2xl px-6 h-12"
        onClick={() => setOpenWithdraw(true)}
      >
        ↑ Вывести
      </Button>

      <TopUpDialog open={openTopUp} setOpen={setOpenTopUp} />
      <WithdrawDialog open={openWithdraw} setOpen={setOpenWithdraw} />
    </div>
  );
}
