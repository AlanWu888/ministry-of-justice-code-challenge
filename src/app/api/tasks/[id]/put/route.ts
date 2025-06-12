import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

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