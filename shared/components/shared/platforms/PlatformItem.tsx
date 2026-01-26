'use client'

import Image from 'next/image'
import { usePlatformsStore } from '@/shared/store/platforms-store'

interface Props {
  id: string
  name: string
  logo?: string | null
}

export const PlatformItem = ({ id, name, logo }: Props) => {
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

      {logo && (
        <Image
          src={logo}
          alt={name}
          width={20}
          height={20}
          className="rounded-sm"
        />
      )}

      <span className="text-sm">{name}</span>
    </label>
  )
}
