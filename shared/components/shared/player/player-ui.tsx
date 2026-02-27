"use client"

import { useEffect, useRef } from "react"
import axios from "axios"
import { usePlayer } from "@/shared/store/global-player"

export const PlayerUI = () => {
  const {
    audioUrl,
    title,
    artist,
    cover,
    isPlaying,
    toggle,
    currentTime,
    duration,
    setTime,
    setDuration,
    volume,
    setVolume,
    releaseId,
  } = usePlayer()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return

    audioRef.current.load()
    audioRef.current.play().catch(() => {})

    if (releaseId) {
      axios.post("/api/play", { releaseId })
        .catch((err) => {
          console.error("Play tracking error:", err)
        })
    }

  }, [audioUrl, releaseId])

  if (!audioUrl) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[900px]
      bg-neutral-900 text-white rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl">

      <img
        src={cover ?? ""}
        className="w-14 h-14 rounded-lg object-cover"
      />

      <div className="w-56">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-neutral-400">{artist}</div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1">
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-white text-black font-bold"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const t = Number(e.target.value)
            if (audioRef.current) audioRef.current.currentTime = t
            setTime(t)
          }}
          className="w-full"
        />
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (audioRef.current) audioRef.current.volume = v
          setVolume(v)
        }}
        className="w-24"
      />

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() =>
          setTime(audioRef.current!.currentTime)
        }
        onLoadedMetadata={() =>
          setDuration(audioRef.current!.duration)
        }
      />
    </div>
  )
}

