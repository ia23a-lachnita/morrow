import { useEffect, useRef, useState } from "react";

const opening = new Map<string, { from: number; at: number }>();

/** Keeps the first balance of this day across a strict-mode remount. */
export function latchOpening(dayKey: string, from: number): number {
  const hit = opening.get(dayKey);
  if (hit && Date.now() - hit.at < 2000) return hit.from;
  opening.set(dayKey, { from, at: Date.now() });
  return from;
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Shows a balance falling from `from` to `target` once per day key,
 * then follows the live second. A later gap, such as returning to the app,
 * drains in view instead of jumping.
 */
export function useWitness(from: number, target: number, dayKey: string): {
  value: number;
  draining: boolean;
} {
  const [value, setValue] = useState(from);
  const [draining, setDraining] = useState(false);
  const valueRef = useRef(target);
  const animating = useRef(false);
  const raf = useRef(0);

  function go(start: number, end: number) {
    cancelAnimationFrame(raf.current);
    if (reducedMotion() || start - end < 45) {
      animating.current = false;
      valueRef.current = end;
      setValue(end);
      setDraining(false);
      return;
    }
    animating.current = true;
    setDraining(true);
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1700);
      const eased = 1 - (1 - p) ** 3;
      const next = Math.round(start + (end - start) * eased);
      valueRef.current = next;
      setValue(next);
      if (p < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        animating.current = false;
        setDraining(false);
      }
    };
    raf.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    go(from, target);
    return () => cancelAnimationFrame(raf.current);
    // The opening balance is captured for this day only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayKey]);

  useEffect(() => {
    if (animating.current) return;
    const shown = valueRef.current;
    if (shown - target >= 45) go(shown, target);
    else if (shown !== target) {
      valueRef.current = target;
      setValue(target);
    }
  }, [target, draining]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { value, draining };
}
