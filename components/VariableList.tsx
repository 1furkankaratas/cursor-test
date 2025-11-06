'use client'

import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { Variable } from '@/types'

interface VariableListProps {
  variables: Variable[]
}

export default function VariableList({ variables }: VariableListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Değişkenler</h3>
      <div className="space-y-2">
        {variables.map(variable => (
          <DraggableVariable key={variable.id} variable={variable} />
        ))}
      </div>
    </div>
  )
}

function DraggableVariable({ variable }: { variable: Variable }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: variable.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        bg-white border-2 border-gray-300 rounded-lg p-3 cursor-grab active:cursor-grabbing
        hover:border-blue-500 hover:shadow-md transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-gray-400" />
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800">{variable.name}</div>
          <div className="text-xs text-gray-500 capitalize">{variable.type}</div>
        </div>
      </div>
    </div>
  )
}
