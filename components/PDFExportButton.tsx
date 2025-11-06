'use client'

import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PDFExportButtonProps {
  canvasRef: React.RefObject<HTMLDivElement>
}

export default function PDFExportButton({ canvasRef }: PDFExportButtonProps) {
  const handleExportPDF = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save('pdf-template.pdf')
    } catch (error) {
      console.error('PDF oluşturma hatası:', error)
      alert('PDF oluşturulurken bir hata oluştu.')
    }
  }

  return (
    <button
      onClick={handleExportPDF}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
    >
      PDF Oluştur ve İndir
    </button>
  )
}
