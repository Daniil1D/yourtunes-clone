'use client'

import React, { useState } from 'react'
import { Pencil, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { deleteRelease } from '@/app/actions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/components/ui'
import { Spinner } from '@/shared/components/shared/spinner'

interface Props {
  id: string
  title: string
  status: 'Черновик' | 'Опубликован'
}

export const ReleaseCard: React.FC<Props> = ({ id, title, status }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    setLoading(true)
    const toastId = toast.loading('Удаляем релиз...')

    try {
      await deleteRelease(id)
      toast.success('Релиз удалён', { id: toastId })
      router.refresh()
    } catch {
      toast.error('Ошибка при удалении', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4 border rounded-2xl p-4 bg-white">
      <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
        🎵
      </div>

      <div className="flex-1">
        <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 mb-1">
          {status}
        </span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          className="justify-start gap-2"
          onClick={() => router.push(`/releases/${id}/edit`)}
        >
          <Pencil className="w-4 h-4" />
          Редактировать
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
           <Button variant="secondary" className="justify-start gap-2" disabled={loading}>
              {loading ? <Spinner /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Удаляем...' : 'Удалить'}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Удалить релиз?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Релиз <b>«{title}»</b> будет удалён навсегда.
                Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Удаляем...' : 'Удалить'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className="justify-start gap-2"
          onClick={() => router.push(`/releases/${id}`)}
        >
          Подробнее
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
