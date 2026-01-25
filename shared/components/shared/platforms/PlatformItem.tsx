'use client'

import { usePlatformsStore } from '@/shared/store/platforms-store'

interface Props {
  id: string
  name: string
}

export const PlatformItem = ({ id, name }: Props) => {
  const { selectedIds, toggle } = usePlatformsStore()

  const checked = selectedIds.includes(id)

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggle(id)}
        className="accent-black w-4 h-4"
      />
      <span className="text-sm">{name}</span>
    </label>
  )
}
