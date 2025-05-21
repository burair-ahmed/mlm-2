// utils/permissions.ts
import { IUser } from '../../models/User';  // or wherever your TS interface lives

/**
 * A pure, synchronous check against the already-loaded
 * `user.permissions` array.
 */
export function hasPermission(user: IUser | null, slug: string): boolean {
  if (!user?.customPermissions) return false;
  return user.customPermissions.includes(slug);
}
