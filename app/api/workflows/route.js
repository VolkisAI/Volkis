import { writeFile, readdir } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

// Get the absolute path to the public/workflows directory
const workflowsDir = join(process.cwd(), 'public', 'workflows')

export async function POST(request) {
  try {
    const workflow = await request.json()
    
    // Ensure notes are included in the workflow data
    workflow.nodes = workflow.nodes.map(node => ({
      ...node,
      note: node.note || '' // Ensure note property exists
    }))
    
    const filename = `workflow-${Date.now()}.json`
    const filepath = join(workflowsDir, filename)
    
    await writeFile(filepath, JSON.stringify(workflow, null, 2))
    
    return NextResponse.json({ success: true, filename })
  } catch (error) {
    console.error('Error saving workflow:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const files = await readdir(workflowsDir)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    
    return NextResponse.json({ files: jsonFiles })
  } catch (error) {
    console.error('Error reading workflows:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
} 