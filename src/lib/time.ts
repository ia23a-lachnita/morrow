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

export function figure(
  now: Date,
  begunAt: number | null,
): { value: number; caption: string } {
  if (begunAt == null) return { value: FULL_DAY, caption: "Funded." };
  const elapsed = Math.floor((now.getTime() - begunAt) / 1000);
  const value = Math.max(0, FULL_DAY - elapsed);
  if (value === 0) return { value: 0, caption: "It refills at dawn." };
  return { value, caption: "Still yours." };
}
