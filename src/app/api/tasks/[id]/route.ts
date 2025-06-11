import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const UNAUTHORISED = NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

function isAuthorised(req: NextRequest) {
  const header = req.headers.get('authorization')
  return header === `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED

  const task = await prisma.task.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  return NextResponse.json(task)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED

  const body = await req.json()
  const { status } = body

  const updated = await prisma.task.update({
    where: { id: parseInt(params.id) },
    data: { status },
  })

  return NextResponse.json(updated)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED;

  const body = await req.json();

  const allowedFields = ['title', 'description', 'status', 'dueDate'];
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
      where: { id: parseInt(params.id) },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED

  await prisma.task.delete({
    where: { id: parseInt(params.id) },
  })

  return NextResponse.json({ message: 'Task deleted' })
}
