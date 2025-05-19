import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const authResult = await authenticate(req);
  if (authResult instanceof NextResponse) return authResult;

  return NextResponse.json(authResult);
}

