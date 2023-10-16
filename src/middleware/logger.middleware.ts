import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/config/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new CustomLogger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, } = req;
    
    const userAgent = req.get('user-agent') || '';
    this.logger.log(`[Call] ${method} ${originalUrl} - ${userAgent} ${ip}`);

    res.on('finish', () => {
        const contentLength = res.get('content-length');
        const { statusCode } = res;

        this.logger.log(
          `[Done] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        );
      });
  
    next();
  }
}