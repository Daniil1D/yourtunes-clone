'use client'

import axios from 'axios'
import { useState, useRef } from 'react'
import { Button } from '@/shared/components/ui/button'
import toast from 'react-hot-toast'

export const UploadAudioClient = ({ releaseId }: { releaseId: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const onFilesSelect = (list: FileList | null) => {
    if (!list) return
    setFiles(prev => [...prev, ...Array.from(list)])
  }

  const uploadFiles = async () => {
    if (!files.length) {
      toast.error('Выберите файлы')
      return
    }

    setLoading(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('releaseId', releaseId)

        await axios.post('/api/upload/audio', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      toast.success('Файлы загружены')
      setFiles([])
    } catch {
      toast.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        onDrop={e => {
          e.preventDefault()
          onFilesSelect(e.dataTransfer.files)
        }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-2xl p-10 text-center bg-gray-50"
      >
        <div className="w-24 h-24 mx-auto rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
          🎵
        </div>

        <p className="mt-4 font-medium">
          Перетащите файлы сюда
        </p>

        <p className="text-sm text-gray-500">
          .wav / .mp3
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".wav,.mp3"
        hidden
        onChange={e => onFilesSelect(e.target.files)}
      />

      <div className="flex gap-4">
        <Button
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          Выбрать файлы
        </Button>

        <Button
          onClick={uploadFiles}
          disabled={loading}
        >
          {loading ? 'Загружаем...' : 'Загрузить'}
        </Button>
      </div>

      {files.length > 0 && (
        <ul className="text-sm text-gray-600 list-disc pl-5">
          {files.map(file => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

