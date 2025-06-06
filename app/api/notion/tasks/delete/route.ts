import { NextRequest, NextResponse } from 'next/server';
import { getTaskByPhaseAndIndex, deleteTask } from '@/lib/notion-tasks';

export async function DELETE(request: NextRequest) {
  try {
    const { phaseId, taskIndex, taskId } = await request.json();
    
    // Support both taskId (preferred) and phaseId+taskIndex (backward compatibility)
    let targetTaskId = taskId;
    
    if (!targetTaskId && phaseId !== undefined && taskIndex !== undefined) {
      // Backward compatibility: find task by phase and index
      const task = await getTaskByPhaseAndIndex(phaseId, taskIndex);
      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      targetTaskId = task.id;
    }
    
    if (!targetTaskId) {
      return NextResponse.json(
        { error: 'Task ID or phase ID with task index is required' },
        { status: 400 }
      );
    }

    // Archive the task
    await deleteTask(targetTaskId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 