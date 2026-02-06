"use client"

import React from "react";
import { Button } from "@/shared/components/ui/button";

interface TracklistActionsProps {
  onAddTrack?: () => void;
}

export const TracklistActions: React.FC<TracklistActionsProps> = ({ onAddTrack }) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full h-14 rounded-xl border text-lg"
        onClick={onAddTrack}
      >
        + Ещё один трек
      </Button>

      <Button
        className="w-full h-14 rounded-xl border text-lg"
      >
        Далее
      </Button>

      <Button
        variant="outline"
        className="text-sm text-gray-500"
        onClick={() => history.back()}
      >
        ← Назад
      </Button>
    </div>
  );
};
