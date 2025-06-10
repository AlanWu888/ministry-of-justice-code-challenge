import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const UNAUTHORISED = NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

function isAuthorised(req: NextRequest) {
  const header = req.headers.get('authorization')
  return header === `Bearer ${process.env.API_SECRET}`
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorised(req)) return UNAUTHORISED

  await prisma.task.delete({
    where: { id: parseInt(params.id) },
  })

  return NextResponse.json({ message: 'Task deleted' })
}
