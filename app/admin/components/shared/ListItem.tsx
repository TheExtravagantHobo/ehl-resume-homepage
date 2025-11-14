import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface ListItemProps {
  children: React.ReactNode
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export function ListItem({
  children,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: ListItemProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">{children}</div>
        <div className="flex flex-col gap-1 ml-4">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}