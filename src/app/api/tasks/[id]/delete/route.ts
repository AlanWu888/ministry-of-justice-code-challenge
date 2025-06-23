import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

/**
 * @route   DELETE /api/tasks/[id]
 * @desc    Permanently delete a task by ID, but only if it's archived
 * @access  Protected (requires Authorization header)
 * 
 * @param   req - The incoming HTTP DELETE request
 * @param   context - Contains route parameters, specifically `id`
 * 
 * @returns
 * - 200: `{ message: "Task deleted" }` on successful deletion
 * - 401: If request is unauthorized
 * - 403: If task is not archived and deletion is attempted
 * - 404: If task with given ID is not found
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED;

  const id = parseInt(params.id);

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (!task.archived) {
    return NextResponse.json({ error: 'Only archived tasks can be deleted' }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ message: 'Task deleted' });
}
