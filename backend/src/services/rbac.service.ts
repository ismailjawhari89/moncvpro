
import { AdminRole } from '@prisma/client';

export enum AdminPermission {
    // User Management
    USER_VIEW = 'user:view',
    USER_EDIT = 'user:edit',
    USER_DELETE = 'user:delete',
    USER_SUSPEND = 'user:suspend',

    // Subscription Management
    SUBSCRIPTION_VIEW = 'subscription:view',
    SUBSCRIPTION_REFUND = 'subscription:refund',
    SUBSCRIPTION_UPGRADE = 'subscription:upgrade',

    // Analytics
    ANALYTICS_VIEW = 'analytics:view',
    ANALYTICS_EXPORT = 'analytics:export',

    // System Settings
    SETTINGS_EDIT = 'settings:edit',
}

// Define permission matrix
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
    [AdminRole.SUPER_ADMIN]: Object.values(AdminPermission),
    [AdminRole.ADMIN]: [
        AdminPermission.USER_VIEW,
        AdminPermission.USER_EDIT,
        AdminPermission.SUBSCRIPTION_VIEW,
        AdminPermission.SUBSCRIPTION_REFUND,
        AdminPermission.SUBSCRIPTION_UPGRADE,
        AdminPermission.ANALYTICS_VIEW,
        AdminPermission.ANALYTICS_EXPORT,
    ],
    [AdminRole.MODERATOR]: [
        AdminPermission.USER_VIEW,
        AdminPermission.USER_SUSPEND,
    ],
    [AdminRole.SUPPORT]: [
        AdminPermission.USER_VIEW,
        AdminPermission.SUBSCRIPTION_VIEW,
    ],
};

export class RBACService {
    /**
     * Check if a role has a specific permission
     */
    static hasPermission(role: AdminRole, permission: AdminPermission): boolean {
        const permissions = ROLE_PERMISSIONS[role];
        return permissions ? permissions.includes(permission) : false;
    }

    /**
     * Get all permissions for a role
     */
    static getPermissions(role: AdminRole): AdminPermission[] {
        return ROLE_PERMISSIONS[role] || [];
    }
}
