'use client'

import { useDroppable } from '@dnd-kit/core'
import { useState, forwardRef } from 'react'
import { X, Move } from 'lucide-react'
import { Variable } from '@/types'

interface PDFCanvasProps {
  items: any[]
  variables: Variable[]
  onUpdateItem: (id: string, updates: Partial<any>) => void
  onDeleteItem: (id: string) => void
}

const PDFCanvas = forwardRef<HTMLDivElement, PDFCanvasProps>(({
  items,
  variables,
  onUpdateItem,
  onDeleteItem,
}, ref) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  })

  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent, item: any) => {
    if (e.target instanceof HTMLElement && e.target.closest('.delete-btn')) {
      return
    }
    setSelectedItem(item.id)
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedItem) {
      const canvasRect = e.currentTarget.getBoundingClientRect()
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y
      onUpdateItem(selectedItem, {
        x: Math.max(0, Math.min(newX, 794 - 200)),
        y: Math.max(0, Math.min(newY, 1123 - 100)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div
        ref={setNodeRef}
        className="bg-white shadow-2xl"
        style={{
          width: '210mm',
          height: '297mm',
          minHeight: '297mm',
          position: 'relative',
          border: isOver ? '3px dashed #3b82f6' : '1px solid #e5e7eb',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* PDF İçeriği */}
        <div 
          ref={ref}
          className="absolute inset-0 p-8"
        >
          {items.map(item => {
            const variable = variables.find(v => v.id === item.variableId)
            return (
              <div
                key={item.id}
                className={`absolute border-2 rounded ${
                  selectedItem === item.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                } bg-white cursor-move`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                  minHeight: `${item.height}px`,
                }}
                onMouseDown={(e) => handleMouseDown(e, item)}
                onClick={() => setSelectedItem(item.id)}
              >
                <div className="p-2 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      {item.variableName}
                    </span>
                    <button
                      className="delete-btn opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteItem(item.id)
                        setSelectedItem(null)
                      }}
                    >
                      <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400 border border-dashed border-gray-300 rounded p-2 min-h-[20px]">
                    {item.type === 'textarea' ? (
                      <div className="whitespace-pre-wrap">
                        {variable?.value || `{{${item.variableName}}}`}
                      </div>
                    ) : (
                      <span>{variable?.value || `{{${item.variableName}}}`}</span>
                    )}
                  </div>
                  {selectedItem === item.id && (
                    <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs px-1 rounded">
                      <Move className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Değişkenleri buraya sürükleyin</p>
              <p className="text-sm">PDF şablonunuzu oluşturmaya başlayın</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

PDFCanvas.displayName = 'PDFCanvas'

export default PDFCanvas
