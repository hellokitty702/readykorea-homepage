'use client';

import { useEffect, useState } from 'react';

const format = (date: Date) =>
  date.toLocaleString('en-GB', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Current time in Korea ("Fri 14:32"), where the schools and most applicants' interviews are. */
export function SeoulClock({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(timer);
  }, []);
  return (
    // The server's minute can differ from the browser's.
    <time dateTime={now.toISOString()} className={className} suppressHydrationWarning>
      {format(now).replace(',', '')}
    </time>
  );
}
