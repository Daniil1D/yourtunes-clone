"use client"

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { useRouter, useParams } from "next/navigation"

interface TracklistActionsProps {
  onAddTrack?: () => void;
  allTracksReady: boolean;
}

export const TracklistActions: React.FC<TracklistActionsProps> = ({ onAddTrack, allTracksReady }) => {
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const releaseId = params.id 
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
        onClick={() => router.push(`/releases/${releaseId}/information-releases`)}
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
