"use client"

import { create } from "zustand"

type PlayerData = {
  audioUrl?: string
  title?: string
  artist?: string
  cover?: string
  releaseId?: string
}

type PlayerState = PlayerData & {
  isPlaying: boolean
  duration: number
  currentTime: number
  volume: number

  play: (data: PlayerData) => void
  toggle: () => void
  setTime: (time: number) => void
  setDuration: (time: number) => void
  setVolume: (v: number) => void
}

export const usePlayer = create<PlayerState>((set) => ({
  audioUrl: undefined,
  title: undefined,
  artist: undefined,
  cover: undefined,
  releaseId: undefined,

  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 1,

  play: (data) =>
    set({
      ...data,
      isPlaying: true,
      currentTime: 0,
    }),

  toggle: () =>
    set((s) => ({ isPlaying: !s.isPlaying })),

  setTime: (time) => set({ currentTime: time }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v }),
}))

