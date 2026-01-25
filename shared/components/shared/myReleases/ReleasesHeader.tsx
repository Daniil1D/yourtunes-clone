'use client'

import { Plus, LayoutGrid, List } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Title } from '../title'
import { createRelease } from '@/app/actions'
import toast from "react-hot-toast";

interface Props {
  className?: string
}

export const ReleasesHeader: React.FC<Props> = ({ className }) => {
  const router = useRouter()

  const onCreate = async () => {
    try {
      const releaseId = await createRelease()
      router.push(`${releaseId}/platforms`)
    } catch (e) {
      console.error(e)
      toast.success('Не удалось создать релиз')
    }
  }

  return (
    <div className="space-y-4">
      <Title text="Мои релизы" size="2xl" className="font-bold" />

      <div className="flex items-center gap-4 bg-white h-[50px] border rounded-2xl">
        <div className="relative w-full max-w-md p-5">
          <Input placeholder="Поиск" className="pl-10" />
          <span className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 p-5">
          <Button variant="ghost" size="icon">
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <button
        onClick={onCreate}
        className="
          w-full border-2 border-dashed rounded-2xl
          py-10 flex items-center justify-center gap-3
          text-xl font-semibold text-gray-600
          hover:border-black hover:text-black
          transition
        "
      >
        <Plus className="w-6 h-6" />
        Новый релиз
      </button>
    </div>
  )
}
