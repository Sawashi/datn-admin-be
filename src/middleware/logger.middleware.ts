import { Logger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger();
    res.on('finish', () => {
      const logMessage = `${req.method} {${req.headers.host}${req.originalUrl}, ${res.statusCode}}`;
      if (res.statusCode >= 400) {
        logger.error(logMessage, res.statusMessage);
      } else {
        logger.log(logMessage, res.statusMessage);
      }
    });
    next();
  }
}
