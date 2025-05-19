// lib/auth/permissionUtils.ts
import User from '../../models/User';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function hasPermission(user: any, requiredSlug: string): Promise<boolean> {
  if (!user) return false;

  // Load the full user with populated role.permissions if needed
  if (!user.getEffectivePermissions) {
    user = await User.findById(user._id).populate({
      path: 'customRoleId',
      populate: {
        path: 'permissions',
        select: 'slug',
      },
    });
  }

  const effectivePermissions = await user.getEffectivePermissions?.();

  return effectivePermissions?.includes(requiredSlug);
}
