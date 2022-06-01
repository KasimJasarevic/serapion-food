import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger,} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private logger = new Logger(ErrorFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let errorRes: any = {
      now: new Date(),
      path: req.url,
      method: req.method,
      message: exception.message || null,
    };

    try {
      errorRes.code = exception.getStatus();
    } catch (e) {
      errorRes.code = 500;
    }

    this.logger.error(
      `METHOD:[${req.method}] URL:[${req.url}] TIME:[${errorRes.now}]`,
      exception.stack,
      'ErrorFilter',
    );

    res.status(errorRes.code).json(errorRes);
  }
}
