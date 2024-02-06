import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message']
          ? exception.getResponse()['message']
          : exception['message']
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    const prodErrorResponse: { statusCode: number; message: string } = {
      statusCode,
      message,
    };

    this.logger.log(
      `Request method: ${request.method}, request url: ${request.url}`,
      JSON.stringify(devErrorResponse),
    );

    const environment = 'development'; // TODO: change to process.env.NODE_ENV

    response
      .status(statusCode)
      .send(
        environment === 'development' ? devErrorResponse : prodErrorResponse,
      );
  }
}
