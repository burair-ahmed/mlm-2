import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Permission from '../../../../../../models/Permission';
import { authenticate } from '../../../../../../middleware/auth';
import { hasPermission } from '../../../../../../lib/auth/permissionUtils';

export async function POST(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  const allowed = await hasPermission(auth, 'create_permission');
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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