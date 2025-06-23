import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

/**
 * @route   GET /api/tasks
 * @desc    Fetch all tasks (optionally filter by status)
 * @access  Protected
 * @returns {Task[]} List of task objects
 */
export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) return UNAUTHORISED;

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  let where = {};

  if (statusParam === "ARCHIVED") {
    where = { archived: true };
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(tasks);
}

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Protected
 * @body    { title: string, description: string, dueDate: string, status: "TODO"|"IN_PROGRESS"|"DONE" }
 * @returns {Task} The created task object
 */
export async function POST(req: NextRequest) {
  if (!isAuthorised(req)) return UNAUTHORISED;

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
