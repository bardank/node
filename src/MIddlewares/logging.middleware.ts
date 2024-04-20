import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('LoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url } = req;

    res.on('finish', () => {
      const end = Date.now();
      const duration = end - start;
      const statusCode = res.statusCode;
      this.logger.log(`${method} ${url} ${statusCode} ${duration} ms`);
    });

    next();
  }
}
