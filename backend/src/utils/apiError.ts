
export class ApiError extends Error {
  statusCode: number;
  code: string;
  errors?: any;

  constructor(
    statusCode: number,
    message: string,
    code: string = 'GENERIC_ERROR',
    errors?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.name = this.constructor.name;
    
    // Capturing stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string, code = 'BAD_REQUEST', errors?: any): ApiError {
    return new ApiError(400, msg, code, errors);
  }

  static unauthorized(msg: string = 'Unauthorized', code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(401, msg, code);
  }

  static forbidden(msg: string = 'Forbidden', code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, msg, code);
  }

  static notFound(msg: string = 'Resource not found', code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, msg, code);
  }

  static conflict(msg: string = 'Conflict', code = 'CONFLICT', errors?: any): ApiError {
    return new ApiError(409, msg, code, errors);
  }

  static tooMany(msg: string = 'Too many requests', code = 'TOO_MANY_REQUESTS'): ApiError {
    return new ApiError(429, msg, code);
  }

  static internal(msg: string = 'Internal server error', code = 'INTERNAL_SERVER_ERROR'): ApiError {
    return new ApiError(500, msg, code);
  }
}
