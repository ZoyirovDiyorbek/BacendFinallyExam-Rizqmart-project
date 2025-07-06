import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const context = host.switchToHttp();
      const response = context.getResponse<Response>();
  
      const exceptionResponse = exception.getResponse();
      const status = exception.getStatus();
  
      let message = exception.message;
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as any;
        if (Array.isArray(res.message)) {
          message = res.message.join(', ');
        } else {
          message = res.message || exception.message;
        }
      }
  
      response.status(status).send({
        message,
        statusCode: status,
        error: exception.name,
        occurredAt: new Date().toISOString(),
      });
    }
  }
  