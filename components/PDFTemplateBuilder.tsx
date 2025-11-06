'use client'

import { useState, useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import VariableList from '@/components/VariableList'
import PDFCanvas from '@/components/PDFCanvas'
import PDFExportButton from '@/components/PDFExportButton'
import { Variable } from '@/types'

export default function PDFTemplateBuilder() {
  const [variables, setVariables] = useState<Variable[]>([
    { id: '1', name: 'Ad Soyad', type: 'text', value: '' },
    { id: '2', name: 'E-posta', type: 'text', value: '' },
    { id: '3', name: 'Telefon', type: 'text', value: '' },
    { id: '4', name: 'Tarih', type: 'date', value: '' },
    { id: '5', name: 'Adres', type: 'textarea', value: '' },
  ])

  const [canvasItems, setCanvasItems] = useState<any[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === 'canvas' && canvasRef.current) {
      const variable = variables.find(v => v.id === active.id)
      if (variable) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const activatorEvent = event.activatorEvent as MouseEvent | null
        
        let x = 50
        let y = 50
        
        if (activatorEvent) {
          x = activatorEvent.clientX - canvasRect.left - 100
          y = activatorEvent.clientY - canvasRect.top - 50
          
          // Canvas sınırları içinde tut
          x = Math.max(0, Math.min(x, 794 - 200))
          y = Math.max(0, Math.min(y, 1123 - 100))
        }
        
        const newItem = {
          id: `item-${Date.now()}`,
          variableId: variable.id,
          variableName: variable.name,
          type: variable.type,
          x,
          y,
          width: variable.type === 'textarea' ? 300 : 200,
          height: variable.type === 'textarea' ? 100 : 40,
        }
        setCanvasItems([...canvasItems, newItem])
      }
    }

    setActiveId(null)
  }

  const updateItem = (id: string, updates: Partial<any>) => {
    setCanvasItems(items =>
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    )
  }

  const deleteItem = (id: string) => {
    setCanvasItems(items => items.filter(item => item.id !== id))
  }

  const activeVariable = variables.find(v => v.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sol Panel - Değişken Listesi */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">PDF Şablon Oluşturucu</h1>
            <p className="text-sm text-gray-600 mt-1">Değişkenleri sürükleyip bırakın</p>
          </div>
          <VariableList variables={variables} />
        </div>

        {/* Orta Panel - PDF Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <PDFCanvas
            ref={canvasRef}
            items={canvasItems}
            variables={variables}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        </div>

        {/* Sağ Panel - Özellikler */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Özellikler</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Boyutu
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>A4 (210 x 297 mm)</option>
                <option>Letter (216 x 279 mm)</option>
                <option>Legal (216 x 356 mm)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yönlendirme
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>Dikey</option>
                <option>Yatay</option>
              </select>
            </div>
            <PDFExportButton canvasRef={canvasRef} />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeVariable ? (
          <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium text-blue-800">{activeVariable.name}</div>
            <div className="text-xs text-blue-600">{activeVariable.type}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
