export type ErrorCode = 
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CUTOFF_PASSED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly status: number = 400,
    public readonly details: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new AppError('BAD_REQUEST', message, 400, details);
  }

  static unauthorized(message: string = 'Authentication required') {
    return new AppError('UNAUTHORIZED', message, 401);
  }

  static forbidden(message: string = 'Access denied') {
    return new AppError('FORBIDDEN', message, 403);
  }

  static cutoffPassed(cutoffTime: string) {
    return new AppError(
      'CUTOFF_PASSED', 
      'The RSVP deadline for this fixture has closed.', 
      403, 
      { cutoff_at: cutoffTime, server_time: new Date().toISOString() }
    );
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError('NOT_FOUND', message, 404);
  }

  toResponse(): Response {
    return new Response(
      JSON.stringify({
        error: {
          code: this.code,
          message: this.message,
          status: this.status,
          details: this.details,
        }
      }),
      {
        status: this.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
