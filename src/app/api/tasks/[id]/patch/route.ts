import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

/**
 * @route   PATCH /api/tasks/[id]/patch
 * @desc    Update a task by ID. Allows partial updates of title, description, status, dueDate, or archived.
 * @access  Protected (requires Authorization header)
 * 
 * @param   req - The incoming HTTP PATCH request
 * @param   context - Contains route parameters, specifically `id`
 * 
 * @body
 * {
 *   "title"?: string,
 *   "description"?: string,
 *   "status"?: "TODO" | "IN_PROGRESS" | "DONE",
 *   "dueDate"?: string (ISO format),
 *   "archived"?: boolean
 * }
 * 
 * @returns
 * - 200: JSON object with the updated task
 * - 400: If no valid fields are provided
 * - 401: If unauthorised
 * - 500: On server/database error
 */
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED;

  const { id } = await context.params;
  const body = await req.json();

  const allowedFields = ['title', 'description', 'status', 'dueDate', 'archived'];
  const data: any = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      data[key] = body[key];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
