import { NextRequest, NextResponse } from 'next/server';

export const UNAUTHORISED = NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export function isAuthorised(req: NextRequest) {
  const header = req.headers.get('authorization');
  return header === `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`;
}