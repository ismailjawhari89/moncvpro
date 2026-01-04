import { Logform } from 'logform';

declare module 'winston' {
  interface Logger {
    // Accept (message, ...meta) or (infoObject)
    info(message: string, ...meta: any[]): void;
    info(infoObject: Logform.TransformableInfo): void;

    error(message: string, ...meta: any[]): void;
    error(infoObject: Logform.TransformableInfo): void;

    warn(message: string, ...meta: any[]): void;
    warn(infoObject: Logform.TransformableInfo): void;

    debug(message: string, ...meta: any[]): void;
    debug(infoObject: Logform.TransformableInfo): void;
  }
}
