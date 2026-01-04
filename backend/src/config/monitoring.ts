export const monitoringConfig = {
    uptime: {
        frontend: 'https://moncvpro.com/health',
        api: 'https://api.moncvpro.com/health/live',
        frequency: 60, // seconds
        timeout: 5000, // ms
    },
    thresholds: {
        errorRate: 0.01, // 1%
        responseTimeP95: 500, // ms
        memoryUsage: 80, // %
        cpuUsage: 80, // %
        dbConnectionPool: 90, // %
    },
    alerts: {
        critical: ['api_down', 'db_disconnected', 'auth_system_failure'],
        high: ['high_error_rate', 'high_latency', 'backup_failure'],
        medium: ['new_error_type', 'disk_space_low'],
    }
};
