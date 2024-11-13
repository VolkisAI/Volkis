'use client'

const NODE_TYPES = [
  {
    type: 'start',
    label: 'Start',
    color: 'border-green-500',
    icon: '▶️'
  },
  {
    type: 'process',
    label: 'Process',
    color: 'border-blue-500',
    icon: '⚙️'
  },
  {
    type: 'condition',
    label: 'Condition',
    color: 'border-yellow-500',
    icon: '❓'
  },
  {
    type: 'action',
    label: 'Action',
    color: 'border-purple-500',
    icon: '⚡'
  },
  {
    type: 'end',
    label: 'End',
    color: 'border-red-500',
    icon: '🔚'
  }
]

export default function NodeToolbar({ onAddNode }) {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex gap-4 border border-base-300">
      {NODE_TYPES.map((nodeType) => (
        <button
          key={nodeType.type}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors`}
          onClick={() => onAddNode(nodeType)}
          title={`Add ${nodeType.label} Node`}
        >
          <span className="text-xl">{nodeType.icon}</span>
          <span className="text-sm font-medium">{nodeType.label}</span>
        </button>
      ))}
    </div>
  )
} 