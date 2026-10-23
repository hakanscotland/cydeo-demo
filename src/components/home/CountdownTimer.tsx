'use client';

import React, { useEffect, useState } from 'react';
import { calculateCountdown } from '@/lib/rules/time';

interface CountdownTimerProps {
  targetUtc: string;
}

export default function CountdownTimer({ targetUtc }: CountdownTimerProps) {
  const [formatted, setFormatted] = useState<string>('--:--:--');

  useEffect(() => {
    const update = () => {
      const res = calculateCountdown(targetUtc);
      setFormatted(res.formatted);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetUtc]);

  return (
    <div
      data-testid="countdown-timer"
      style={{
        fontSize: '1.75rem',
        fontWeight: 'bold',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--color-accent-gold)',
        letterSpacing: '0.05em',
      }}
    >
      {formatted}
    </div>
  );
}
