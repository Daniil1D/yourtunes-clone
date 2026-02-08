"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import toast from "react-hot-toast"
import { upsertArtistCard } from "@/app/actions"

interface Props {
  artistName: string
  releaseId: string
  card?: {
    spotifyUrl?: string | null
    appleMusicUrl?: string | null
    socialUrl?: string | null
    ready: boolean
  }
}

export function ArtistCardForm({ artistName, releaseId, card }: Props) {
  const [spotifyUrl, setSpotifyUrl] = useState(card?.spotifyUrl ?? "")
  const [appleMusicUrl, setAppleMusicUrl] = useState(card?.appleMusicUrl ?? "")
  const [socialUrl, setSocialUrl] = useState(card?.socialUrl ?? "")
  const [ready, setReady] = useState(card?.ready ?? false)
  const [loading, setLoading] = useState(false)

  const onSave = async () => {
    try {
      setLoading(true)
      await upsertArtistCard({
        releaseId,
        name: artistName,
        spotifyUrl,
        appleMusicUrl,
        socialUrl,
        ready: true,
      })
      setReady(true)
      toast.success("Данные сохранены")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border p-6 space-y-4">
      <h3 className="text-xl font-bold">{artistName}</h3>

      <input
        className="input"
        placeholder="Spotify — ссылка на артиста"
        value={spotifyUrl}
        onChange={e => setSpotifyUrl(e.target.value)}
      />

      <input
        className="input"
        placeholder="Apple Music — ссылка на артиста"
        value={appleMusicUrl}
        onChange={e => setAppleMusicUrl(e.target.value)}
      />

      <input
        className="input"
        placeholder="Социальная сеть артиста"
        value={socialUrl}
        onChange={e => setSocialUrl(e.target.value)}
      />

      {!ready ? (
        <Button onClick={onSave} disabled={loading}>
          Готово
        </Button>
      ) : (
        <div className="text-green-600 font-medium">
          ✔ Заполнено
        </div>
      )}
    </div>
  )
}
