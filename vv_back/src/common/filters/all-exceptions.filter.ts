import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

interface HttpRequestLike {
  method: string;
  url: string;
  id?: string | number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const response = context.getResponse();
    const request =
      context.getRequest<HttpRequestLike>();

    const requestId =
      request.id !== undefined
        ? String(request.id)
        : 'unknown';

    const isHttpException =
      exception instanceof HttpException;

    const statusCode = isHttpException
      ? exception.getStatus()
      : 500;

    let message =
      'Internal server error';

    let errorCode =
      'INTERNAL_SERVER_ERROR';

    if (isHttpException) {
      errorCode = `HTTP_${statusCode}`;

      const exceptionResponse =
        exception.getResponse();

      if (
        typeof exceptionResponse === 'string'
      ) {
        message = exceptionResponse;
      } else if (
        exceptionResponse &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const candidate =
          (
            exceptionResponse as {
              message?: unknown;
            }
          ).message;

        if (Array.isArray(candidate)) {
          message = candidate.join(', ');
        } else if (candidate !== undefined) {
          message = String(candidate);
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    }

    const logMessage =
      `${request.method} ${request.url} -> ` +
      `${statusCode} [${requestId}]`;

    if (statusCode >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error
          ? exception.stack
          : String(exception),
      );
    } else {
      this.logger.warn(logMessage);
    }

    response.status(statusCode).send({
      statusCode,
      error: {
        code: errorCode,
        message,
      },
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
