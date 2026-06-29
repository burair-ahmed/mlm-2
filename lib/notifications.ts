import mongoose from 'mongoose';
import dbConnect from './dbConnect';
import Notification from '../models/Notification';

export interface CreateNotificationInput {
  title: string;
  message: string;
  type: 'deposit' | 'withdrawal' | 'kyc' | 'commission' | 'profit' | 'resale' | 'system';
  link?: string;
}

export async function createNotification(
  userId: string | mongoose.Types.ObjectId,
  data: CreateNotificationInput
) {
  try {
    await dbConnect();
    
    // Ensure we convert string userId to ObjectId if necessary
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    const newNotification = await Notification.create({
      userId: userObjectId,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link,
      isRead: false,
    });

    console.log(`[Notification Created] For User: ${userId}, Title: "${data.title}"`);
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}
