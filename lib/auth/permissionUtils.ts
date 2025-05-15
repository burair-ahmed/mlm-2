import Role from '../../models/Role'; // Adjust path based on your structure

// Interface for dynamic permission object
interface Permission {
  slug: string;
}

// Static map for default roles
const staticRolePermissionsMap: Record<string, string[]> = {
  'super-admin': ['*'],
  'admin': [
    'kyc.approve',
    'user.view',
    'withdrawal.manage',
    // more static permissions
  ],
  'user': [
    'profile.view',
    'package.buy',
    // etc.
  ],
};

interface UserWithRole {
  role?: {
    name?: string;
  };
}

export async function hasPermission(
  user: UserWithRole | null,
  roleOrPermission: string
): Promise<boolean> {
  if (!user || !user.role || !user.role.name) return false;

  const userRoleName = user.role.name;

  // Check if checking for a role directly
  if (roleOrPermission in staticRolePermissionsMap) {
    return userRoleName === roleOrPermission;
  }

  // 1. Check static rolePermissionsMap first
  const staticPermissions = staticRolePermissionsMap[userRoleName];
  if (staticPermissions) {
    if (staticPermissions.includes('*') || staticPermissions.includes(roleOrPermission)) {
      return true;
    }
  }

  // 2. Check for dynamic roles (custom roles) from DB
  try {
    const roleFromDB = await Role.findOne({ name: userRoleName }).populate('permissions');
    if (!roleFromDB) return false;

    const dynamicPermissions = (roleFromDB.permissions as Permission[]).map(
      (perm) => perm.slug
    );

    if (dynamicPermissions.includes('*') || dynamicPermissions.includes(roleOrPermission)) {
      return true;
    }
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }

  return false;
}
