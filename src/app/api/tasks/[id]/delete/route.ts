import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorised, UNAUTHORISED } from '@/utils/api';

  export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if (!isAuthorised(req)) return UNAUTHORISED
  
    await prisma.task.delete({
      where: { id: parseInt(params.id) },
    })
  
    return NextResponse.json({ message: 'Task deleted' })
  }