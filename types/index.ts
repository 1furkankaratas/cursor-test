export interface Variable {
  id: string
  name: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'image'
  value: string
}

export interface CanvasItem {
  id: string
  variableId: string
  variableName: string
  type: string
  x: number
  y: number
  width: number
  height: number
}
