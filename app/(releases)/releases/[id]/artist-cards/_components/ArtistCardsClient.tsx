"use client"

import { Button } from "@/shared/components/ui/button"
import { useRouter } from "next/navigation"
import { ArtistCardForm } from "./ArtistCardForm"
import { ArtistCard } from "@prisma/client"


interface Props {
  releaseId: string
  artistNames: string[]
  cards: ArtistCard[]
}

export function ArtistCardsClient({
  releaseId,
  artistNames,
  cards,
}: Props) {
  const router = useRouter()

  const allReady = artistNames.every(name =>
    cards.find(c => c.name === name && c.ready)
  )

  return (
    <div className="space-y-8">
      {artistNames.map(name => (
        <ArtistCardForm
          key={name}
          artistName={name}
          releaseId={releaseId}
          card={cards.find(c => c.name === name)}
        />
      ))}

      <div className="flex flex-col gap-4 pt-6">
        <Button
          className="h-14 text-lg"
          disabled={!allReady}
          onClick={() => router.push(`/releases/${releaseId}/review`)}
        >
          Далее
        </Button>

        {!allReady && (
          <p className="text-sm text-gray-500 text-center">
            Укажите информацию о картах артиста каждого артиста в релизе
          </p>
        )}

        <Button variant="outline" onClick={() => router.back()}>
          ← Назад
        </Button>
      </div>
    </div>
  )
}
