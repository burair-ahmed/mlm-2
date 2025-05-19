// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '../dbConnect';
// import User from '../../models/User';
// import { authenticate } from '../../middleware/auth';

// type PermissionSlug = string;

// interface PopulatedPermission {
//   slug: string;
// }

// interface PopulatedRole {
//   permissionIds: PopulatedPermission[];
// }

// interface PopulatedUser {
//   roleId: PopulatedRole;
// }

// export function withPermission(
//   requiredPermission: PermissionSlug,
//   handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>
// ) {
//   return async (req: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
//     await dbConnect();

//     const auth = await authenticate(req);
//     if (auth instanceof NextResponse) return auth;

//     const user = auth.user;
//     if (!user?.roleId) {
//       return NextResponse.json({ error: 'Role not assigned' }, { status: 403 });
//     }

//     const populatedUser = (await User.findById(user._id).populate({
//       path: 'roleId',
//       populate: {
//         path: 'permissionIds',
//         model: 'Permission',
//       },
//     })) as PopulatedUser;

//     const permissions: string[] = populatedUser.roleId.permissionIds.map(
//       (p) => p.slug
//     );

//     const isAllowed = permissions.includes(requiredPermission);

//     if (!isAllowed) {
//       return NextResponse.json({ error: 'Forbidden: Permission denied' }, { status: 403 });
//     }

//     return handler(req, ...args);
//   };
// }
