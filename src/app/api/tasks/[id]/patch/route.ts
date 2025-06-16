import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

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
