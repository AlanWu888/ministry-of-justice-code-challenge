import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function isAuthorised(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  let where = {};

  if (statusParam === "ARCHIVED") {
    where = { archived: true };
  } else {
    where = { archived: false };
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, status, dueDate } = body

  if (!title || !status || !dueDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate: new Date(dueDate),
    },
  })

  return NextResponse.json(task)
}
