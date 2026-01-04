
declare global {
    namespace Express {
        interface Request {
            requestId: string;
            log: any;
            audit?: {
                ip?: string;
                userAgent?: string;
            };
        }
    }
}

export { };
