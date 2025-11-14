import { Plus } from 'lucide-react'
import { ListItem } from './ListItem'

interface ListManagerProps<T> {
  title: string
  items: T[]
  onAdd: () => void
  onUpdate: (index: number, field: string, value: any) => void
  onDelete: (index: number) => void
  onMove: (index: number, direction: 'up' | 'down') => void
  renderItem: (item: T, index: number, handlers: ItemHandlers) => React.ReactNode
}

interface ItemHandlers {
  onUpdate: (field: string, value: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export function ListManager<T extends { id: string }>({
  title,
  items,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  renderItem,
}: ListManagerProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          Add {title.slice(0, -1)}
        </button>
      </div>

      {items.map((item, index) => (
        <ListItem
          key={item.id}
          onMoveUp={() => onMove(index, 'up')}
          onMoveDown={() => onMove(index, 'down')}
          onDelete={() => onDelete(index)}
          canMoveUp={index > 0}
          canMoveDown={index < items.length - 1}
        >
          {renderItem(item, index, {
            onUpdate: (field, value) => onUpdate(index, field, value),
            onDelete: () => onDelete(index),
            onMoveUp: () => onMove(index, 'up'),
            onMoveDown: () => onMove(index, 'down'),
            canMoveUp: index > 0,
            canMoveDown: index < items.length - 1,
          })}
        </ListItem>
      ))}
    </div>
  )
}