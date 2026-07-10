import AuditLog from '../../models/AuditLog';
import mongoose from 'mongoose';

export async function logAdminAction(params: {
  adminId: string | mongoose.Types.ObjectId;
  action: string;
  targetId: string | mongoose.Types.ObjectId;
  targetModel: string;
  details: string;
  session?: mongoose.ClientSession;
}) {
  try {
    const log = new AuditLog({
      adminId: params.adminId,
      action: params.action,
      targetId: params.targetId,
      targetModel: params.targetModel,
      details: params.details,
    });
    
    if (params.session) {
      await log.save({ session: params.session });
    } else {
      await log.save();
    }
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
