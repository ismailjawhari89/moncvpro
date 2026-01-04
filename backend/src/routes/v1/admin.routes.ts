
import { Router } from 'express';
import { adminController } from '../../controllers/admin.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { authorizeAdmin } from '../../middleware/adminAuthorization.middleware';
import { logAdminAction } from '../../middleware/adminAudit.middleware';
import { AdminPermission } from '../../services/rbac.service';
import { cacheMiddleware } from '../../middleware/cacheMiddleware';

const router = Router();

// Apply authMiddleware globally to all admin routes
router.use(authMiddleware);

// --- User Management ---
router.get('/users',
    authorizeAdmin(AdminPermission.USER_VIEW),
    cacheMiddleware(600, ['admin:users']),
    adminController.listUsers
);

router.get('/users/:id',
    authorizeAdmin(AdminPermission.USER_VIEW),
    adminController.getUserDetails
);

router.post('/users/:id/suspend',
    authorizeAdmin(AdminPermission.USER_SUSPEND),
    logAdminAction('USER_SUSPENDED'),
    adminController.suspendUser
);

router.post('/users/:id/reactivate',
    authorizeAdmin(AdminPermission.USER_EDIT),
    logAdminAction('USER_REACTIVATED'),
    adminController.reactivateUser
);

router.delete('/users/:id',
    authorizeAdmin(AdminPermission.USER_DELETE),
    logAdminAction('USER_DELETED'),
    adminController.deleteUser
);

router.post('/users/:id/email',
    authorizeAdmin(AdminPermission.USER_EDIT),
    logAdminAction('ADMIN_EMAIL_SENT'),
    adminController.sendEmailToUser
);

// --- Subscription Management ---
router.get('/subscriptions',
    authorizeAdmin(AdminPermission.SUBSCRIPTION_VIEW),
    cacheMiddleware(600, ['admin:subscriptions']),
    adminController.listSubscriptions
);

// --- Analytics ---
router.get('/analytics/overview',
    authorizeAdmin(AdminPermission.ANALYTICS_VIEW),
    cacheMiddleware(300, ['admin:analytics']),
    adminController.getOverview
);

// --- System ---
router.get('/health',
    authorizeAdmin(AdminPermission.SETTINGS_EDIT),
    adminController.getHealthStatus
);

export default router;
