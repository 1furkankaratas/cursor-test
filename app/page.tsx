import type { Metadata } from 'next'
import PDFTemplateBuilder from '@/components/PDFTemplateBuilder'

export const metadata: Metadata = {
  title: 'PDF Şablon Oluşturucu',
  description: 'Sürükle-bırak ile PDF şablonları oluşturun',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PDFTemplateBuilder />
    </main>
  )
}
