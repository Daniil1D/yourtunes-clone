import { create } from "zustand";

export interface ReleaseDraft {
  id?: string;
  title: string;
  artist: string;
  label: string;
  genre: string;
  version?: string;
  publishDate: Date | null;
  cover?: string | null;
}

interface ReleaseState {
  release: ReleaseDraft;
  step: number;

  setRelease: (data: Partial<ReleaseDraft>) => void;
  setStep: (step: number) => void;

  resetRelease: () => void;
}

const initialState: ReleaseDraft = {
  id: undefined,
  title: "",
  artist: "",
  label: "",
  genre: "",
  version: "",
  publishDate: null,
  cover: null,
};

export const useReleaseStore = create<ReleaseState>((set) => ({
  release: initialState,
  step: 1,

  setRelease: (data) =>
    set((state) => ({
      release: { ...state.release, ...data },
    })),

  setStep: (step) => set({ step }),

  resetRelease: () =>
    set({
      release: initialState,
      step: 1,
    }),
}));

