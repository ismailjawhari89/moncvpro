import { Logform } from 'logform';

declare module 'winston' {
  interface Logger {
    // Override to accept both parameter orders: (infoObject, message) and (message, infoObject)
    error(message: string, meta?: any): void;
    error(info: Logform.TransformableInfo, message?: string): void;

    warn(message: string, meta?: any): void;
    warn(info: Logform.TransformableInfo, message?: string): void;

    info(message: string, meta?: any): void;
    info(info: Logform.TransformableInfo, message?: string): void;

    debug(message: string, meta?: any): void;
    debug(info: Logform.TransformableInfo, message?: string): void;
  }
}
