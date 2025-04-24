
import { Response } from 'express';

export interface ApiResponseOptions {
  statusCode?: number;
  message?: string;
  code?: string;
  meta?: Record<string, any>;
}

export class ApiResponse {
  static send(
    res: Response,
    data: any,
    options: ApiResponseOptions = {}
  ): Response {
    const {
      statusCode = 200,
      message = 'Success',
      code = 'SUCCESS',
      meta = {},
    } = options;

    return res.status(statusCode).json({
      status: 'success',
      statusCode,
      message,
      code,
      data,
      meta,
    });
  }

  static success(
    res: Response,
    data: any = null,
    message: string = 'Success',
    meta: Record<string, any> = {}
  ): Response {
    return this.send(res, data, { statusCode: 200, message, code: 'SUCCESS', meta });
  }

  static created(
    res: Response,
    data: any = null,
    message: string = 'Resource created successfully',
    meta: Record<string, any> = {}
  ): Response {
    return this.send(res, data, { statusCode: 201, message, code: 'CREATED', meta });
  }

  static noContent(res: Response): Response {
    return res.status(204).end();
  }
}
