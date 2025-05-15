import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Permission from '../../../../../../models/Permission';
import { authenticate } from '../../../../../../middleware/auth';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (!auth || !auth.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { slug, label } = body;

  if (!slug || !label) {
    return NextResponse.json({ error: 'Slug and label are required' }, { status: 400 });
  }

  try {
    const permission = await Permission.create({ slug: slug.toLowerCase(), label });
    return NextResponse.json(permission);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create permission' }, { status: 500 });
  }
}