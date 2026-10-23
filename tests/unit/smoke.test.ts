import { describe, it, expect } from 'vitest';

describe('GATES-01: Unit Test Gate', () => {
  it('GATES-01: Unit test gate passes with basic assertion', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
