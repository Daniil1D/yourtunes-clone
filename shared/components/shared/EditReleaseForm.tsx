'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { updateRelease } from '@/app/actions'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const EditReleaseForm = ({ release }: any) => {
  const [title, setTitle] = useState(release.title)
  const router = useRouter()

  const onSave = async () => {
    const toastId = toast.loading('Сохраняем...')

    try {
      await updateRelease(release.id, { title })
      toast.success('Сохранено', { id: toastId })
      router.push('/releases')
    } catch {
      toast.error('Ошибка', { id: toastId })
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Редактирование релиза</h1>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название релиза"
      />

      <Button onClick={onSave}>Сохранить</Button>
    </div>
  )
}
