import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Permission from '../../../../../models/Permission';

export async function GET() {
  await dbConnect();

  try {
    const permissions = await Permission.find().lean();
    return NextResponse.json(permissions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
