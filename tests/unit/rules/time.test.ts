import { describe, it, expect } from 'vitest';
import { calculateCountdown, formatKickoff, isCutoffPassed } from '@/lib/rules/time';

describe('Time and Countdown Rules', () => {
  it('AC-2.1.2: Next match live countdown dynamically decrements time to kickoff', () => {
    const now = new Date('2026-11-07T12:00:00.000Z');
    const kickoff = new Date('2026-11-07T15:30:00.000Z');

    const countdown = calculateCountdown(kickoff, now);
    expect(countdown.isPast).toBe(false);
    expect(countdown.hours).toBe(3);
    expect(countdown.minutes).toBe(30);
    expect(countdown.seconds).toBe(0);

    // Test past match
    const pastNow = new Date('2026-11-07T16:00:00.000Z');
    const pastCountdown = calculateCountdown(kickoff, pastNow);
    expect(pastCountdown.isPast).toBe(true);
  });

  it('Evaluates cutoff deadline accurately', () => {
    const cutoff = '2026-11-07T14:00:00.000Z';
    const beforeCutoff = new Date('2026-11-07T13:59:59.000Z');
    const afterCutoff = new Date('2026-11-07T14:00:01.000Z');

    expect(isCutoffPassed(cutoff, beforeCutoff)).toBe(false);
    expect(isCutoffPassed(cutoff, afterCutoff)).toBe(true);
  });

  it('Formats kickoff in venue timezone Europe/London', () => {
    const kickoffUtc = '2026-11-07T15:00:00.000Z';
    const formatted = formatKickoff(kickoffUtc, 'Europe/London');
    expect(formatted.timeString).toBe('15:00');
    expect(formatted.dayOfWeek).toContain('Sat');
  });
});
