import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * Custom throttler guard that works behind a proxy (like nginx, load balancer)
 * It uses the X-Forwarded-For header to get the real client IP
 */
@Injectable()
export class ThrottleBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Use X-Forwarded-For header if behind a proxy, otherwise use IP
    const expressReq = req as Request;
    const ip =
      (expressReq.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      expressReq.ip ||
      expressReq.socket.remoteAddress ||
      'unknown';
    return Promise.resolve(ip);
  }
}
