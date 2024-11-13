'use client'

import { useState, useEffect, useRef } from 'react'

const NodeNote = ({ isOpen, note, onSave, onClose }) => {
  const [noteText, setNoteText] = useState(note || '')
  const [editingTaskIndex, setEditingTaskIndex] = useState(null)
  const noteRef = useRef(null)
  const textareaRef = useRef(null)
  const taskInputRef = useRef(null)

  // Auto-focus textarea when note opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (noteText !== note) {
        onSave(noteText)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [noteText, note, onSave])

  const handleNoteChange = (e) => {
    setNoteText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === '[') {
      e.preventDefault()
      const cursorPosition = e.target.selectionStart
      
      // Remove the [ character and get the text after it
      const beforeCursor = noteText.slice(0, cursorPosition)
      const afterCursor = noteText.slice(cursorPosition + 1)
      
      // Update the note text without the [ character
      setNoteText(beforeCursor + afterCursor)
      
      // Create a new empty task and set it to editing mode
      const newTaskIndex = noteText.split('\n')
        .filter(line => line.trim().startsWith('[ ]') || line.trim().startsWith('[x]'))
        .length
      
      // Add new task line
      setNoteText(prev => `${prev}\n[ ] `)
      setEditingTaskIndex(newTaskIndex)
      
      // Focus the new task input
      requestAnimationFrame(() => {
        if (taskInputRef.current) {
          taskInputRef.current.focus()
        }
      })
    }
  }

  // Get tasks from noteText
  const tasks = noteText.split('\n')
    .filter(line => line.trim().startsWith('[ ]') || line.trim().startsWith('[x]'))
    .map(line => ({
      text: line.slice(4).trim(),
      completed: line.trim().startsWith('[x]')
    }))

  const toggleTask = (index) => {
    const lines = noteText.split('\n')
    let taskIndex = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('[ ]') || lines[i].trim().startsWith('[x]')) {
        taskIndex++
        if (taskIndex === index) {
          const isCompleted = lines[i].trim().startsWith('[x]')
          lines[i] = lines[i].replace(
            isCompleted ? '[x]' : '[ ]',
            isCompleted ? '[ ]' : '[x]'
          )
          break
        }
      }
    }
    
    setNoteText(lines.join('\n'))
  }

  const updateTaskText = (index, newText) => {
    const lines = noteText.split('\n')
    let taskIndex = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('[ ]') || lines[i].trim().startsWith('[x]')) {
        taskIndex++
        if (taskIndex === index) {
          const isCompleted = lines[i].trim().startsWith('[x]')
          lines[i] = `${isCompleted ? '[x]' : '[ ]'} ${newText}`
          break
        }
      }
    }
    
    setNoteText(lines.join('\n'))
    setEditingTaskIndex(null)
  }

  // Get notes without tasks
  const displayNotes = noteText
    .split('\n')
    .filter(line => !line.trim().startsWith('[ ]') && !line.trim().startsWith('[x]'))
    .join('\n')

  return (
    <div 
      className={`absolute -bottom-2 left-0 w-full transform translate-y-full transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
      style={{ zIndex: 50 }}
      ref={noteRef}
    >
      <div className="relative mt-2 bg-white rounded-lg border-2 border-blue-500 shadow-lg p-3">
        <button 
          onClick={() => {
            onSave(noteText)
            onClose()
          }}
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
          style={{ fontSize: '16px', lineHeight: 1 }}
        >
          ×
        </button>

        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-white border-2 border-blue-500 rotate-45 transform -translate-y-1/2" 
               style={{ borderBottom: 'none', borderRight: 'none' }}
          />
        </div>

        <div className="mb-2 text-xs text-gray-500">
          Tip: Press [ to create a task
        </div>

        <textarea
          ref={textareaRef}
          className="w-full min-h-[100px] p-2 text-sm bg-white focus:outline-none resize-none rounded-md"
          placeholder="Add notes about this process..."
          value={displayNotes}
          onChange={handleNoteChange}
          onKeyDown={handleKeyDown}
          style={{
            color: '#374151',
            fontSize: '14px',
            lineHeight: '1.5',
            caretColor: 'black',
          }}
          spellCheck="true"
        />

        {tasks.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <div className="text-sm font-medium mb-1">Tasks:</div>
            {tasks.map((task, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-sm hover:bg-gray-50 p-1 rounded group"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="checkbox checkbox-sm"
                />
                {editingTaskIndex === index ? (
                  <input
                    ref={taskInputRef}
                    type="text"
                    value={task.text}
                    onChange={(e) => {
                      const lines = noteText.split('\n')
                      let taskIndex = -1
                      
                      for (let i = 0; i < lines.length; i++) {
                        if (lines[i].trim().startsWith('[ ]') || lines[i].trim().startsWith('[x]')) {
                          taskIndex++
                          if (taskIndex === index) {
                            const isCompleted = lines[i].trim().startsWith('[x]')
                            lines[i] = `${isCompleted ? '[x]' : '[ ]'} ${e.target.value}`
                            break
                          }
                        }
                      }
                      
                      setNoteText(lines.join('\n'))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingTaskIndex(null)
                      } else if (e.key === 'Escape') {
                        setEditingTaskIndex(null)
                      }
                      e.stopPropagation()
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                    autoFocus
                  />
                ) : (
                  <span 
                    className={`flex-1 cursor-text ${task.completed ? 'line-through text-gray-400' : ''}`}
                    onClick={() => setEditingTaskIndex(index)}
                  >
                    {task.text || 'New Task'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NodeNote 