import { describe, it, expect } from 'vitest';
import { AppError } from '@/lib/rules/errors';

describe('Error Rules & Session Handling', () => {
  it('AC-1.6.4: Gracefully handles expired session with 401 redirect', () => {
    const expiredError = AppError.unauthorized('Session has expired. Please sign in again.');
    expect(expiredError.status).toBe(401);
    expect(expiredError.code).toBe('UNAUTHORIZED');
    expect(expiredError.message).toBe('Session has expired. Please sign in again.');

    const response = expiredError.toResponse();
    expect(response.status).toBe(401);
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
});
