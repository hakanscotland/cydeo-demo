export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  formatted: string;
}

export function calculateCountdown(
  targetTime: string | Date, 
  now: Date = new Date()
): CountdownResult {
  const target = typeof targetTime === 'string' ? new Date(targetTime) : targetTime;
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, formatted: '00:00:00' };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = days > 0
    ? `${days}d ${hours}h ${minutes}m`
    : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { days, hours, minutes, seconds, isPast: false, formatted };
}

export function isCutoffPassed(
  cutoffTime: string | Date, 
  now: Date = new Date()
): boolean {
  const cutoffDate = typeof cutoffTime === 'string' ? new Date(cutoffTime) : cutoffTime;
  return now.getTime() >= cutoffDate.getTime();
}

export function formatKickoff(
  utcTimestamp: string | Date, 
  timezone: string = 'Europe/London'
): { fullDate: string; timeString: string; dayOfWeek: string } {
  const date = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;

  const dayOfWeek = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: timezone }).format(date);
  const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: timezone }).format(date);
  const timeString = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone }).format(date);

  return { fullDate, timeString, dayOfWeek };
}
