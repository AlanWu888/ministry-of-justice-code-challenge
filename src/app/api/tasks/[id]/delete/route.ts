import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

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
