import { Container, Title } from '@/shared/components/shared'
import { UploadAudioClient } from '@/shared/components/shared/upload/UploadAudioClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UploadAudioPage({ params }: PageProps) {
  const { id: releaseId } = await params
  

  return (
    <Container className="space-y-8 mt-10">
      <Title text="Загрузите аудиофайлы" size="2xl" className="font-bold" />

      <p className="text-gray-500 max-w-2xl">
        Для сохранения наилучшего качества треков, рекомендуем загружать файлы
        формата <b>.wav</b> 16/24 44100 Hz bit (только с импульсно-кодовой
        модуляцией)
      </p>

      <UploadAudioClient releaseId={releaseId} />
    </Container>
  )
}
