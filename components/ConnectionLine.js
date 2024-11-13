import React from 'react'

const ConnectionLine = ({
  connection,
  getNodeById,
  getHandlePosition,
  calculateSCurve,
  handleDeleteConnection,
  temporary = false,
}) => {
  const renderLabel = (label, fromX, fromY, toX, toY) => {
    if (!label) return null

    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2 - 15

    return (
      <foreignObject
        x={midX - 20}
        y={midY - 12}
        width="40"
        height="24"
      >
        <div className="bg-white px-2 py-0.5 rounded text-xs border shadow-sm text-center">
          {label}
        </div>
      </foreignObject>
    )
  }

  let fromX, fromY, toX, toY

  if (temporary) {
    const fromNode = connection.sourceNode
    const toPosition = connection.target

    if (!fromNode || !toPosition) return null

    const sourceHandleType = connection.sourceHandle
    const sourcePos = getHandlePosition(fromNode, sourceHandleType)

    fromX = sourcePos.x
    fromY = sourcePos.y

    toX = toPosition.x
    toY = toPosition.y

    return (
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <path
          d={calculateSCurve(
            fromX,
            fromY,
            toX,
            toY,
            connection.sourceHandle,
            'left',
            connection.label
          )}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        {connection.label && renderLabel(connection.label, fromX, fromY, toX, toY)}
      </svg>
    )
  }

  if (!temporary) {
    const sourceNode = getNodeById(connection.sourceId)
    const targetNode = getNodeById(connection.targetId)

    if (!sourceNode || !targetNode) return null

    const sourceHandleType = connection.sourceHandle
    const targetHandleType = connection.targetHandle

    const sourcePos = getHandlePosition(sourceNode, sourceHandleType)
    const targetPos = getHandlePosition(targetNode, targetHandleType)

    fromX = sourcePos.x
    fromY = sourcePos.y

    toX = targetPos.x
    toY = targetPos.y

    return (
      <svg
        className="absolute top-0 left-0"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#6B46C1" />
          </linearGradient>
          <filter id={`glow-${connection.id}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g 
          className="group transition-all duration-300"
          onMouseEnter={(e) => {
            const path = e.currentTarget.querySelector('path')
            const deleteBtn = e.currentTarget.querySelector('.connection-delete')
            if (path) {
              path.style.filter = `url(#glow-${connection.id})`
              path.style.stroke = '#6B46C1'
              path.style.strokeWidth = '3'
            }
            if (deleteBtn) deleteBtn.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            const path = e.currentTarget.querySelector('path')
            const deleteBtn = e.currentTarget.querySelector('.connection-delete')
            if (path) {
              path.style.filter = 'none'
              path.style.stroke = `url(#gradient-${connection.id})`
              path.style.strokeWidth = '2'
            }
            if (deleteBtn) {
              setTimeout(() => {
                deleteBtn.style.opacity = '0'
              }, 100)
            }
          }}
        >
          <path
            d={calculateSCurve(
              fromX,
              fromY,
              toX,
              toY,
              connection.sourceHandle,
              connection.targetHandle,
              connection.label
            )}
            fill="none"
            stroke={`url(#gradient-${connection.id})`}
            strokeWidth="2"
            strokeDasharray="8,8"
            className="animate-dash cursor-pointer transition-all duration-300"
          />
          
          {connection.label && renderLabel(connection.label, fromX, fromY, toX, toY)}

          {/* Delete Button */}
          <foreignObject
            x={(fromX + toX) / 2 - 10}
            y={(fromY + toY) / 2 - 10}
            width="20"
            height="20"
            className="connection-delete opacity-0 transition-opacity duration-200 pointer-events-auto"
          >
            <div
              className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteConnection(connection.id)
              }}
              title="Delete connection"
            >
              ×
            </div>
          </foreignObject>
        </g>
      </svg>
    )
  }
}

export default ConnectionLine 