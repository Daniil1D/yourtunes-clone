'use client'

import { usePlatformsAutosave } from '@/shared/hooks/usePlatformsAutosave'

export const PlatformsAutosave = ({ releaseId }: { releaseId: string }) => {
  usePlatformsAutosave(releaseId)
  return null
}
