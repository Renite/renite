// Role -> allowed permissions. 'admin' has full platform access via wildcard.
// 'police' is scoped to case/safety operations only — no user directory access.
export const PERMISSIONS = {
  user: [
    'profile:read:own', 'profile:update:own',
    'report:create', 'report:read:own'
  ],
  police: [
    'profile:read:own', 'profile:update:own',
    'report:create', 'report:read:own',
    'case:read', 'case:close',
    'announcement:create',
    'alert:issue',
    'verification:review'
  ],
  admin: ['*']
};

export function hasPermission(role, permission) {
  const perms = PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}
