import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED;

  const task = await prisma.task.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  return NextResponse.json(task);
}
