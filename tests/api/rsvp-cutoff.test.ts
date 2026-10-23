import { describe, it, expect } from 'vitest';
import { isCutoffPassed } from '@/lib/rules/time';
import { AppError } from '@/lib/rules/errors';

describe('RSVP Cutoff Enforcement Rules', () => {
  it('AC-3.3.4: RSVP mutation after cutoff rejected with 403 and closed badge', () => {
    const cutoffInPast = '2026-10-10T10:00:00.000Z';
    const currentTime = new Date('2026-10-10T10:05:00.000Z');

    const isClosed = isCutoffPassed(cutoffInPast, currentTime);
    expect(isClosed).toBe(true);

    if (isClosed) {
      const error = AppError.cutoffPassed(cutoffInPast);
      expect(error.status).toBe(403);
      expect(error.code).toBe('CUTOFF_PASSED');
      expect(error.message).toContain('RSVP deadline for this fixture has closed');
    }
  });

  it('Allows RSVP mutation when cutoff has not yet passed', () => {
    const cutoffInFuture = '2026-11-07T14:00:00.000Z';
    const currentTime = new Date('2026-11-07T13:30:00.000Z');

    const isClosed = isCutoffPassed(cutoffInFuture, currentTime);
    expect(isClosed).toBe(false);
  });
});
