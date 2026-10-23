'use client';

import { useEffect, useState, useCallback } from 'react';

export interface AttendanceCounts {
  going: number;
  maybe: number;
  not_going: number;
  is_rsvp_closed: boolean;
}

export function useAttendancePolling(
  fixtureId: string,
  initialCounts: AttendanceCounts,
  intervalMs: number = 5000
) {
  const [counts, setCounts] = useState<AttendanceCounts>(initialCounts);

  useEffect(() => {
    if (initialCounts) {
      setCounts(prev => {
        if (
          prev.going === initialCounts.going &&
          prev.maybe === initialCounts.maybe &&
          prev.not_going === initialCounts.not_going &&
          prev.is_rsvp_closed === initialCounts.is_rsvp_closed
        ) {
          return prev;
        }
        return initialCounts;
      });
    }
  }, [
    initialCounts?.going,
    initialCounts?.maybe,
    initialCounts?.not_going,
    initialCounts?.is_rsvp_closed,
  ]);

  const fetchCounts = useCallback(async () => {
    // Only poll when browser tab is actively visible to preserve bandwidth/battery
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }

    try {
      const res = await fetch(`/api/fixtures/${fixtureId}/counts`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data: AttendanceCounts = await res.json();
        setCounts(data);
      }
    } catch {
      // Silently ignore polling network failures
    }
  }, [fixtureId]);

  useEffect(() => {
    // Trigger on mount and then on every intervalMs
    const interval = setInterval(fetchCounts, intervalMs);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCounts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCounts, intervalMs]);

  return { counts, refetch: fetchCounts };
}
