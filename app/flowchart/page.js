'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import CustomNode from '@/components/CustomNode'
import ConnectionLine from '@/components/ConnectionLine'
import NodeToolbar from '@/components/NodeToolbar'
import { saveAs } from 'file-saver'

export default function FlowchartPage() {
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [scale, setScale] = useState(1)
  const [connectionStart, setConnectionStart] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [draggedNode, setDraggedNode] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [draggingConnection, setDraggingConnection] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [savedWorkflows, setSavedWorkflows] = useState([])
  const [showWorkflowModal, setShowWorkflowModal] = useState(false)
  
  const canvasRef = useRef(null)
  const dragNodeRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0 })

  // Load saved workflows on component mount
  useEffect(() => {
    fetchSavedWorkflows()
  }, [])

  const fetchSavedWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      if (data.files) {
        setSavedWorkflows(data.files)
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
    }
  }

  // Handle canvas dragging
  const handleCanvasDrag = useCallback((e) => {
    if (!isDragging || !canvasRef.current) return
    canvasRef.current.scrollLeft -= e.movementX / scale
    canvasRef.current.scrollTop -= e.movementY / scale
  }, [isDragging, scale])

  // Function to get the position of handles
  const getHandlePosition = useCallback((node, handle) => {
    const nodeWidth = 200
    const nodeHeight = 100
    let x = node.x
    let y = node.y + 50 // Default center Y
    
    if (handle === 'left') {
      x = node.x
      y = node.y + nodeHeight / 2
    } else if (handle === 'right') {
      x = node.x + nodeWidth
      y = node.y + nodeHeight / 2
    } else if (handle === 'right-yes') {
      x = node.x + nodeWidth
      y = node.y + nodeHeight * 0.25
    } else if (handle === 'right-no') {
      x = node.x + nodeWidth
      y = node.y + nodeHeight * 0.75
    }

    return { x, y }
  }, [])

  // Function to calculate the S-curve path
  const calculateSCurve = useCallback((fromX, fromY, toX, toY, sourceHandle, targetHandle, label) => {
    const dx = Math.abs(toX - fromX)
    const dy = toY - fromY
    
    const curveIntensity = Math.min(Math.max(dx * 0.4, 80), 200)
    
    const sourceMultiplier = sourceHandle.startsWith('right') ? 1 : -1
    const targetMultiplier = targetHandle.startsWith('right') ? 1 : -1

    const sourceControlX = fromX + (curveIntensity * sourceMultiplier)
    const targetControlX = toX + (curveIntensity * targetMultiplier * -1)
    
    const verticalOffset = dy * 0.5
    const sourceControlY = fromY + (verticalOffset * 0.2)
    const targetControlY = toY - (verticalOffset * 0.2)
    
    return `M ${fromX} ${fromY}
            C ${sourceControlX} ${sourceControlY},
              ${targetControlX} ${targetControlY},
              ${toX} ${toY}`
  }, [])

  // Modify handleConnectionStart to include handle type and label
  const handleConnectionStart = useCallback((e, node, handle, label = null) => {
    e.stopPropagation()
    const { x, y } = getHandlePosition(node, handle)
    
    setDraggingConnection({
      sourceNode: node,
      sourceHandle: handle,
      label, // 'Yes' or 'No' for condition nodes
      startX: x,
      startY: y
    })
  }, [getHandlePosition])

  // Update addNode to handle multiple outputs for condition nodes
  const addNode = useCallback((nodeType, position) => {
    const newNode = {
      id: `node-${Date.now()}`,
      title: `New ${nodeType.label}`,
      type: nodeType.type,
      x: position.x,
      y: position.y
    }
    
    setNodes(prev => [...prev, newNode])

    // Auto-connect to the last node if it exists
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1]
      const newConnection = {
        id: `conn-${Date.now()}`,
        sourceId: lastNode.id,
        sourceHandle: 'right',
        targetId: newNode.id,
        targetHandle: 'left'
      }
      setConnections(prev => [...prev, newConnection])
    }

    return newNode
  }, [nodes, getHandlePosition])

  // Handle node addition from toolbar
  const handleAddNode = useCallback((nodeType) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const scrollLeft = canvasRef.current.scrollLeft
    const scrollTop = canvasRef.current.scrollTop

    // Calculate center position for new node
    const x = (rect.width / 2 + scrollLeft - 100) / scale // 100 is half node width
    const y = (rect.height / 2 + scrollTop - 50) / scale  // 50 is half node height

    const newNode = addNode(nodeType, { x, y })
    setSelectedNode(newNode)
  }, [addNode, scale])

  // Handle zoom
  const handleZoom = useCallback((delta) => {
    setScale(prev => {
      const newScale = Math.max(0.25, Math.min(2, prev + delta))
      return newScale
    })
  }, [])

  // Fit view
  const fitView = useCallback(() => {
    if (!canvasRef.current || nodes.length === 0) return

    const padding = 50
    const bounds = nodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + 200),
      maxY: Math.max(acc.maxY, node.y + 100)
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })

    const width = bounds.maxX - bounds.minX + padding * 2
    const height = bounds.maxY - bounds.minY + padding * 2
    const scale = Math.min(
      canvasRef.current.clientWidth / width,
      canvasRef.current.clientHeight / height,
      1
    )

    setScale(scale)
    canvasRef.current.scrollLeft = bounds.minX - padding
    canvasRef.current.scrollTop = bounds.minY - padding
  }, [nodes])

  // Handle node editing
  const handleNodeEdit = useCallback((nodeId, newTitle) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, title: newTitle } : node
    ))
  }, [])

  // Handle node deletion
  const handleNodeDelete = useCallback((nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setConnections(prev => prev.filter(conn =>
      conn.sourceId !== nodeId && conn.targetId !== nodeId
    ))
  }, [])

  // Handle connection creation
  const handleConnectionCreate = useCallback((fromNode, toNode) => {
    if (fromNode.id === toNode.id) return
    
    const newConnection = {
      id: `conn-${Date.now()}`,
      from: { node: fromNode },
      to: { node: toNode }
    }
    
    setConnections(prev => [...prev, newConnection])
  }, [])

  // Handle node dragging
  const handleNodeDragStart = useCallback((e, node) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setDraggedNode(node)
    setDragOffset({
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    })
    setSelectedNode(node)
  }, [scale])

  const handleNodeDrag = useCallback((e) => {
    if (!draggedNode || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left + canvasRef.current.scrollLeft) / scale - dragOffset.x
    const y = (e.clientY - rect.top + canvasRef.current.scrollTop) / scale - dragOffset.y

    setNodes(prev => prev.map(node =>
      node.id === draggedNode.id ? { ...node, x, y } : node
    ))
  }, [draggedNode, scale, dragOffset])

  const handleNodeDragEnd = useCallback(() => {
    setDraggedNode(null)
  }, [])

  // Add this function near the top of your component
  const findClosestHandle = useCallback((x, y, nodes) => {
    const snapDistance = 20
    let closest = null
    let minDistance = snapDistance

    nodes.forEach(node => {
      // Get all handle positions for this node
      const handles = ['left', 'right', 'right-yes', 'right-no']
      handles.forEach(handleType => {
        const handlePos = getHandlePosition(node, handleType)
        const dx = x - handlePos.x
        const dy = y - handlePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < minDistance) {
          minDistance = distance
          closest = { x: handlePos.x, y: handlePos.y, handle: handleType, node }
        }
      })
    })

    return closest
  }, [getHandlePosition])

  // Modify handleConnectionDrag to use startX and startY from draggingConnection
  const handleConnectionDrag = useCallback((e) => {
    if (!draggingConnection || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left + canvas.scrollLeft) / scale
    const y = (e.clientY - rect.top + canvas.scrollTop) / scale
    
    // Find closest handle
    const closestHandle = findClosestHandle(x, y, nodes)
    
    if (closestHandle) {
      setMousePosition({ 
        x: closestHandle.x, 
        y: closestHandle.y,
        snapTarget: {
          node: closestHandle.node,
          handle: closestHandle.handle
        }
      })
    } else {
      setMousePosition({ x, y, snapTarget: null })
    }
  }, [draggingConnection, scale, nodes, findClosestHandle])

  // Modify handleConnectionEnd to utilize the specific handle positions
  const handleConnectionEnd = useCallback((e, targetNode, targetHandle) => {
    if (!draggingConnection) return
    
    // Use snapped position if available
    const snapTarget = mousePosition.snapTarget
    let finalTargetNode = targetNode
    let finalTargetHandle = targetHandle

    if (snapTarget) {
      finalTargetNode = snapTarget.node
      finalTargetHandle = snapTarget.handle
    }
    
    if (!finalTargetNode || finalTargetNode.id === draggingConnection.sourceNode.id) {
      setDraggingConnection(null)
      return
    }

    const newConnection = {
      id: `conn-${Date.now()}`,
      sourceId: draggingConnection.sourceNode.id,
      sourceHandle: draggingConnection.sourceHandle,
      targetId: finalTargetNode.id,
      targetHandle: finalTargetHandle,
      label: draggingConnection.label
    }
    
    // Check if connection already exists
    const connectionExists = connections.some(conn => 
      conn.sourceId === newConnection.sourceId && 
      conn.targetId === newConnection.targetId &&
      conn.sourceHandle === newConnection.sourceHandle &&
      conn.targetHandle === newConnection.targetHandle &&
      conn.label === newConnection.label
    )
    
    if (!connectionExists) {
      setConnections(prev => [...prev, newConnection])
    }
    
    setDraggingConnection(null)
  }, [draggingConnection, connections, mousePosition])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedNode) {
        handleNodeDelete(selectedNode.id)
        setSelectedNode(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, handleNodeDelete])

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleNodeDrag)
      document.addEventListener('mouseup', handleNodeDragEnd)
      return () => {
        document.removeEventListener('mousemove', handleNodeDrag)
        document.removeEventListener('mouseup', handleNodeDragEnd)
      }
    }
  }, [draggedNode, handleNodeDrag, handleNodeDragEnd])

  useEffect(() => {
    if (draggingConnection) {
      document.addEventListener('mousemove', handleConnectionDrag)
      document.addEventListener('mouseup', handleConnectionEnd)
      return () => {
        document.removeEventListener('mousemove', handleConnectionDrag)
        document.removeEventListener('mouseup', handleConnectionEnd)
      }
    }
  }, [draggingConnection, handleConnectionDrag, handleConnectionEnd])

  // Add function to get node by id
  const getNodeById = useCallback((nodeId) => {
    return nodes.find(node => node.id === nodeId)
  }, [nodes])

  // Add new functions for save/load
  const saveWorkflow = useCallback(async () => {
    const workflow = {
      nodes,
      connections,
      version: '1.0',
      savedAt: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow)
      })

      const data = await response.json()
      if (data.success) {
        alert('Workflow saved successfully!')
        fetchSavedWorkflows() // Refresh the list
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      alert('Error saving workflow')
    }
  }, [nodes, connections])

  const loadWorkflow = useCallback(async (filename) => {
    try {
      const response = await fetch(`/workflows/${filename}`)
      const workflow = await response.json()
      
      // Validate workflow data
      if (!workflow.nodes || !workflow.connections) {
        throw new Error('Invalid workflow file')
      }

      // Update state with loaded workflow
      setNodes(workflow.nodes)
      setConnections(workflow.connections)
      
      // Reset selection and other states
      setSelectedNode(null)
      setDraggedNode(null)
      setDraggingConnection(null)

      // Close modal
      setShowWorkflowModal(false)

      // Fit view to show all nodes
      setTimeout(fitView, 100)
    } catch (error) {
      console.error('Error loading workflow:', error)
      alert('Error loading workflow file. Please check the file format.')
    }
  }, [fitView])

  // Add WorkflowModal component
  const WorkflowModal = () => {
    if (!showWorkflowModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Load Workflow</h2>
          {savedWorkflows.length === 0 ? (
            <p className="text-gray-500">No saved workflows found</p>
          ) : (
            <div className="space-y-2">
              {savedWorkflows.map((filename) => (
                <button
                  key={filename}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={() => loadWorkflow(filename)}
                >
                  {filename}
                </button>
              ))}
            </div>
          )}
          <button
            className="mt-4 btn btn-ghost btn-sm"
            onClick={() => setShowWorkflowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // Add connection deletion handler
  const handleDeleteConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId))
  }, [])

  // Add handler for note changes
  const handleNoteChange = useCallback((nodeId, noteText) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, note: noteText } : node
    ))
  }, [])

  return (
    <main className="h-screen w-screen overflow-hidden bg-base-100">
      {/* Top Navigation */}
      <nav className="h-14 border-b border-base-300 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Workflow Builder</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Add Save/Load buttons */}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={saveWorkflow}
          >
            Save
          </button>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setShowWorkflowModal(true)}
          >
            Load
          </button>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={fitView}
          >
            Fit View
          </button>
        </div>
      </nav>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-[calc(100vh-3.5rem)] overflow-auto bg-grid-pattern select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => {
          e.preventDefault() // Prevent text selection
          if (e.target === canvasRef.current) {
            setIsDragging(true)
            setSelectedNode(null)
          }
        }}
        onMouseUp={() => {
          setIsDragging(false)
        }}
        onMouseMove={handleCanvasDrag}
      >
        <div
          className="absolute inset-0 min-w-full min-h-full"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Connection Lines */}
          {connections.map((conn) => (
            <ConnectionLine 
              key={conn.id} 
              connection={conn}
              getNodeById={getNodeById}
              getHandlePosition={getHandlePosition}
              calculateSCurve={calculateSCurve}
              handleDeleteConnection={handleDeleteConnection}
            />
          ))}
          {draggingConnection && (
            <ConnectionLine
              connection={draggingConnection}
              getNodeById={getNodeById}
              getHandlePosition={getHandlePosition}
              calculateSCurve={calculateSCurve}
              temporary
            />
          )}

          {/* Nodes */}
          {nodes.map(node => (
            <CustomNode
              key={node.id}
              data={node}
              selected={selectedNode?.id === node.id}
              onDelete={handleNodeDelete}
              onEdit={(newTitle) => handleNodeEdit(node.id, newTitle)}
              onDragStart={(e) => handleNodeDragStart(e, node)}
              onConnectionStart={(e, node, handle, label) => handleConnectionStart(e, node, handle, label)}
              onConnectionEnd={(e, node, handle) => handleConnectionEnd(e, node, handle)}
              onNoteChange={handleNoteChange}
            />
          ))}
        </div>
      </div>

      {/* Node Toolbar */}
      <NodeToolbar onAddNode={handleAddNode} />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          className="btn btn-circle btn-sm"
          onClick={() => handleZoom(-0.1)}
        >
          -
        </button>
        <span className="flex items-center px-2 bg-white rounded">
          {Math.round(scale * 100)}%
        </span>
        <button
          className="btn btn-circle btn-sm"
          onClick={() => handleZoom(0.1)}
        >
          +
        </button>
      </div>

      {/* Add WorkflowModal */}
      <WorkflowModal />
    </main>
  )
} 