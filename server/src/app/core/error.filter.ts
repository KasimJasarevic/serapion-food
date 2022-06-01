import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private logger = new Logger(ErrorFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const status = exception?.getStatus() || 'Unknown';
    const errorRes = {
      code: status,
      now: new Date(),
      path: req.url,
      method: req.method,
      message: exception.message || null,
    };

    this.logger.error(
      `METHOD:[${req.method}] URL:[${req.url}] TIME:[${errorRes.now}]`,
      exception.stack,
      'ErrorFilter',
    );

    res.status(status).json(errorRes);
  }
}
