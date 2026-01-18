"use client";

import React from "react";
import { CartStateItem } from "@/shared/lib/get-cart-details";
import { Button } from "@/shared/components/ui";
import { Trash2 } from "lucide-react";

interface Props {
  item: CartStateItem;
  onRemove: (id: string) => Promise<void>;
}

export const CartCard: React.FC<Props> = ({ item, onRemove }) => {
  const [loading, setLoading] = React.useState(false);

  const handleRemove = async () => {
    setLoading(true);
    await onRemove(item.id);
    setLoading(false);
  };

  return (
   <div className="flex items-center justify-between border rounded-xl p-4 bg-neutral-50">
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-500">
          {item.price} ₽ / шт
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={handleRemove}
        >
          {loading ? "..." : <Trash2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
