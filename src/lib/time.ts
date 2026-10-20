export const FULL_DAY = 86_400;

const count = new Intl.NumberFormat("en-US");
const LETTERS = ["S", "M", "T", "W", "T", "F", "S"] as const;

export function formatCount(n: number): string {
  return count.format(n);
}

export function formatClock(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "a.m." : "p.m.";
  const mm = String(minute).padStart(2, "0");
  return `${h12}:${mm} ${suffix}`;
}

export function dayKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dayBounds(
  now: Date,
  hour: number,
  minute: number,
): { start: Date; end: Date } {
  const start = new Date(now);
  start.setHours(hour, minute, 0, 0);
  if (now < start) start.setDate(start.getDate() - 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export function dayKeyAt(now: Date, hour: number, minute: number): string {
  return dayKeyFromDate(dayBounds(now, hour, minute).start);
}

export function weekdayLetter(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return LETTERS[new Date(y, (m ?? 1) - 1, d ?? 1).getDay()] ?? "";
}

export function recentDayKeys(
  now: Date,
  hour: number,
  minute: number,
  count = 7,
): string[] {
  const { start } = dayBounds(now, hour, minute);
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    keys.push(dayKeyFromDate(d));
  }
  return keys;
}

export type Purse = {
  remaining: number;
  lived: number;
  sleepSeconds: number;
  wakingLeft: number;
  inSleep: boolean;
};

export function purse(
  now: Date,
  wakeH: number,
  wakeM: number,
  sleepH: number,
  sleepM: number,
): Purse {
  const { start, end } = dayBounds(now, wakeH, wakeM);
  const span = Math.max(1, (end.getTime() - start.getTime()) / 1000);
  const elapsed = Math.min(span, Math.max(0, (now.getTime() - start.getTime()) / 1000));
  const remaining = Math.max(0, Math.round(FULL_DAY * (1 - elapsed / span)));
  const lived = FULL_DAY - remaining;
  const afterWake = sleepDelayMinutes(wakeH, wakeM, sleepH, sleepM);
  const sleepSeconds = Math.round(((1440 - afterWake) / 1440) * FULL_DAY);
  const inSleep = elapsed >= (afterWake / 1440) * span;
  const wakingLeft = inSleep ? 0 : Math.max(0, remaining - sleepSeconds);
  return { remaining, lived, sleepSeconds, wakingLeft, inSleep };
}

/** Minutes after wake when sleep starts. At least an hour of day stays waking. */
export function sleepDelayMinutes(
  wakeH: number,
  wakeM: number,
  sleepH: number,
  sleepM: number,
): number {
  const wake = wakeH * 60 + wakeM;
  const sleep = sleepH * 60 + sleepM;
  const delta = (sleep - wake + 1440) % 1440;
  return delta < 60 ? 16 * 60 : delta;
}

/** A line dragged up the purse, from the bottom. One hour of sleep up to eighteen. */
export function sleepClockFromFraction(
  wakeH: number,
  wakeM: number,
  fraction: number,
): { hour: number; minute: number } {
  const clamped = Math.min(18 / 24, Math.max(1 / 24, fraction));
  const duration = Math.round((clamped * 1440) / 5) * 5;
  const delay = 1440 - duration;
  const clock = (wakeH * 60 + wakeM + delay) % 1440;
  return { hour: Math.floor(clock / 60) % 24, minute: clock % 60 };
}

