'use client'

import { useState, useRef, useEffect } from 'react'
import NodeNote from './NodeNote'

const NODE_STYLES = {
  start: {
    border: 'border-green-500',
    label: 'Start'
  },
  process: {
    border: 'border-blue-500',
    label: 'Process'
  },
  condition: {
    border: 'border-yellow-500',
    label: 'Condition',
    outputs: ['Yes', 'No']
  },
  action: {
    border: 'border-purple-500',
    label: 'Action'
  },
  end: {
    border: 'border-red-500',
    label: 'End'
  }
}

const MAX_NODE_WIDTH = 300
const MIN_NODE_HEIGHT = 100

export default function CustomNode({ 
  data, 
  selected, 
  onDelete, 
  onEdit,
  onDragStart,
  onConnectionStart,
  onConnectionEnd,
  onNoteChange
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(data.title || 'New Node')
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [nodeHeight, setNodeHeight] = useState(MIN_NODE_HEIGHT)
  const contentRef = useRef(null)

  const nodeStyle = NODE_STYLES[data.type] || NODE_STYLES.process
  
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight
      const newHeight = Math.max(MIN_NODE_HEIGHT, contentHeight + 40) // 40px for padding
      setNodeHeight(newHeight)
    }
  }, [title])

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onEdit(title)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleBlur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setTitle(data.title)
    }
  }

  return (
    <div 
      className={`absolute bg-white rounded-lg shadow-md border-2 p-4 cursor-move
        ${selected ? 'ring-2 ring-blue-400' : ''} 
        ${nodeStyle.border}`}
      style={{
        left: `${data.x}px`,
        top: `${data.y}px`,
        width: `${MAX_NODE_WIDTH}px`,
        height: `${nodeHeight}px`,
        minHeight: `${MIN_NODE_HEIGHT}px`,
      }}
      onMouseDown={(e) => {
        if (!isEditing && e.target.tagName !== 'INPUT') {
          e.preventDefault()
          onDragStart(e)
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-500 select-none">{nodeStyle.label}</div>
        {data.type === 'process' && (
          <div className="flex items-center gap-1">
            {data.note && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded-full font-medium">
                {data.note.split('\n')
                  .filter(line => line.trim().startsWith('[ ]'))
                  .length || '•'}
              </span>
            )}
            <button
              className={`btn btn-ghost btn-xs ${data.note ? 'text-blue-600' : ''}`}
              onClick={() => setIsNoteOpen(!isNoteOpen)}
              title={data.note ? 'View/edit note' : 'Add note'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div ref={contentRef} className="mt-1">
        {isEditing ? (
          <textarea
            className="w-full border rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            onClick={(e) => {
              e.stopPropagation()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            style={{ 
              userSelect: 'text',
              cursor: 'text',
              WebkitUserSelect: 'text',
              height: 'auto',
              minHeight: '2em'
            }}
          />
        ) : (
          <div 
            className="font-medium cursor-text select-none break-words"
            onDoubleClick={handleDoubleClick}
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </div>
        )}
      </div>
      
      {/* Connection Points */}
      {data.type === 'condition' ? (
        <>
          {/* Left input handle */}
          <div 
            className="absolute w-6 h-6 left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ cursor: 'crosshair' }}
          >
            <div 
              className="w-3 h-3 bg-purple-600 rounded-full hover:scale-125 transition-transform hover:ring-4 hover:ring-purple-200"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onConnectionStart(e, data, 'left')
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                onConnectionEnd(e, data, 'left')
              }}
              data-handle="left"
            />
          </div>
          
          {/* Yes/No output handles */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between">
            {nodeStyle.outputs.map((label) => {
              const handleType = `right-${label.toLowerCase()}`
              const yPosition = label === 'Yes' ? '25%' : '75%'

              return (
                <div 
                  key={label} 
                  className="relative flex items-center"
                  style={{ position: 'absolute', top: yPosition, right: 0, transform: 'translateY(-50%)' }}
                >
                  <span className="absolute right-6 text-xs font-medium text-gray-600 select-none">
                    {label}
                  </span>
                  <div 
                    className="absolute w-6 h-6 right-0 transform translate-x-1/2 flex items-center justify-center"
                    style={{ cursor: 'crosshair' }}
                  >
                    <div 
                      className="w-3 h-3 bg-purple-600 rounded-full hover:scale-125 transition-transform hover:ring-4 hover:ring-purple-200"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onConnectionStart(e, data, handleType, label)
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation()
                        onConnectionEnd(e, data, handleType)
                      }}
                      data-handle={handleType}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* Standard node handles */}
          <div 
            className="absolute w-6 h-6 right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ cursor: 'crosshair' }}
          >
            <div 
              className="w-3 h-3 bg-purple-600 rounded-full hover:scale-125 transition-transform hover:ring-4 hover:ring-purple-200"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onConnectionStart(e, data, 'right')
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                onConnectionEnd(e, data, 'right')
              }}
              data-handle="right"
            />
          </div>
          <div 
            className="absolute w-6 h-6 left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ cursor: 'crosshair' }}
          >
            <div 
              className="w-3 h-3 bg-purple-600 rounded-full hover:scale-125 transition-transform hover:ring-4 hover:ring-purple-200"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onConnectionStart(e, data, 'left')
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                onConnectionEnd(e, data, 'left')
              }}
              data-handle="left"
            />
          </div>
        </>
      )}
      
      {/* Delete Button */}
      <button
        className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center text-sm hover:bg-red-600 select-none"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(data.id)
        }}
      >
        ×
      </button>

      {/* Note Component */}
      {data.type === 'process' && (
        <NodeNote
          isOpen={isNoteOpen}
          note={data.note}
          onSave={(noteText) => {
            onNoteChange(data.id, noteText)
          }}
          onClose={() => setIsNoteOpen(false)}
        />
      )}
    </div>
  )
} 