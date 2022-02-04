import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = ctx.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = new Date();

    return next.handle().pipe(
      tap(() => {
        this.logger.warn(
          `METHOD:[${method}] URL:[${url}] TIME[${now}]`,
          ctx.getClass().name,
        );
      }),
    );
  }
}
