import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Notification from '../../../../models/Notification';
import { authenticate } from '../../../../middleware/auth';

export async function GET(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    // Fetch user's notifications, limit to 50, sorted by newest first
    const notifications = await Notification.find({ userId: auth._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('[GET NOTIFICATIONS ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = await authenticate(req);
  if (auth instanceof NextResponse) return auth;

  await dbConnect();

  try {
    // Mark all notifications for this user as read
    await Notification.updateMany(
      { userId: auth._id, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('[MARK ALL READ ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
