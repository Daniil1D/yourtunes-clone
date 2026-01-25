'use client'

import { useEffect } from 'react'
import { usePlatformsStore } from '@/shared/store/platforms-store'

interface Props {
  selectedIds: string[]
}

export const InitPlatforms = ({ selectedIds }: Props) => {
  const setSelected = usePlatformsStore(state => state.setSelected)

  useEffect(() => {
    setSelected(selectedIds)
  }, [selectedIds, setSelected])

  return null
}
