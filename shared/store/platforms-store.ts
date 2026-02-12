import { create } from 'zustand'

interface PlatformsState {
  selectedIds: string[]
  setSelectedIds: (ids: string[]) => void
  toggle: (id: string) => void
  clearMany: (ids: string[]) => void
  selectMany: (ids: string[]) => void
  setSelected: (ids: string[]) => void
}

export const usePlatformsStore = create<PlatformsState>((set) => ({
  selectedIds: [],
  setSelectedIds: ids => set({ selectedIds: ids }),
  toggle: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter(x => x !== id)
        : [...state.selectedIds, id],
    })),

  selectMany: (ids) =>
    set((state) => ({
      selectedIds: Array.from(new Set([...state.selectedIds, ...ids])),
    })),

  clearMany: (ids) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter(id => !ids.includes(id)),
    })),

  setSelected: (ids) => set({ selectedIds: ids }),
}))
