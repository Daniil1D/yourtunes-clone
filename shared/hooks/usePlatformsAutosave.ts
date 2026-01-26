'use client'

import { useEffect, useRef } from 'react'
import { usePlatformsStore } from '@/shared/store/platforms-store'
import { savePlatforms } from '@/app/actions'
import toast from 'react-hot-toast'

export function usePlatformsAutosave(releaseId: string) {
  const selectedIds = usePlatformsStore(state => state.selectedIds)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await savePlatforms(releaseId, selectedIds)
      } catch (e) {
        toast.error('Ошибка сохранения площадок')
      }
    }, 500) // ⏱ debounce 500мс

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [selectedIds, releaseId])
}
