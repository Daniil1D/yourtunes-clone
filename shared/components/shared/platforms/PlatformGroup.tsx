'use client'

import { usePlatformsStore } from '@/shared/store/platforms-store'
import { Button } from '@/shared/components/ui/button'
import { PlatformItem } from './PlatformItem'

interface Platform {
  id: string
  name: string
  logo?: string | null
}

interface Props {
  title: string
  description?: string
  platforms: Platform[]
}

export const PlatformGroup: React.FC<Props> = ({
  title,
  description,
  platforms,
}) => {
  const { selectedIds, selectMany, clearMany } = usePlatformsStore()

  const platformIds = platforms.map(p => p.id)

  const selectedCount = selectedIds.filter(id =>
    platformIds.includes(id)
  ).length

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        {platforms.map(platform => (
          <PlatformItem
            key={platform.id}
            id={platform.id}
            name={platform.name}
            logo={platform.logo}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Выбрано: {selectedCount}/{platforms.length}
        </span>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => selectMany(platformIds)}
          >
            Выбрать все
          </Button>

          <Button
            variant="outline"
            onClick={() => clearMany(platformIds)}
          >
            Убрать все
          </Button>
        </div>
      </div>
    </div>
  )
}
