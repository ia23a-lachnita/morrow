import { useEffect } from "react";
import { DAWN_NOTE, DUSK_NOTE, midNote } from "@/lib/copy";
import { useApp, useBoot } from "@/lib/store";
import { dayBounds, dayKeyAt, purse, sleepDelayMinutes } from "@/lib/time";

function deliver(body: string) {
  const hidden = document.visibilityState === "hidden";
  if (
    hidden &&
    typeof Notification !== "undefined" &&
    Notification.permission === "granted"
  ) {
    try {
      new Notification("Morrow", { body, tag: "morrow" });
      return;
    } catch {
      /* fall through to the in-app line */
    }
  }
  useBoot.getState().showBanner(body);
}

export function runRitual(now = new Date()) {
  const state = useApp.getState();
  if (!state.introSeen) return;
  const { dawnHour, dawnMinute, sleepHour, sleepMinute } = state;
  const key = dayKeyAt(now, dawnHour, dawnMinute);
  const { start } = dayBounds(now, dawnHour, dawnMinute);
  const span = Math.max(1, dayBounds(now, dawnHour, dawnMinute).end.getTime() - start.getTime()) / 1000;
  const elapsed = (now.getTime() - start.getTime()) / 1000;
  const account = purse(now, dawnHour, dawnMinute, sleepHour, sleepMinute);
  const fired = state.fired[key] ?? {};

  if (
    state.notices.dawn &&
    !fired.dawn &&
    elapsed <= 30 * 60 &&
    document.visibilityState === "hidden"
  ) {
    state.markFired(key, "dawn");
    deliver(DAWN_NOTE);
    return;
  }

  const afterWake = sleepDelayMinutes(dawnHour, dawnMinute, sleepHour, sleepMinute);
  const midAt = ((afterWake / 2) / 1440) * span;
  if (state.notices.mid && !fired.mid && Math.abs(elapsed - midAt) <= 15 * 60) {
    state.markFired(key, "mid");
    deliver(midNote(account.remaining));
    return;
  }

  const sleepAt = (afterWake / 1440) * span;
  if (
    state.notices.dusk &&
    !fired.dusk &&
    elapsed >= sleepAt - 20 * 60 &&
    elapsed < sleepAt + 10 * 60
  ) {
    state.markFired(key, "dusk");
    deliver(DUSK_NOTE);
  }
}

export function Ritual() {
  const ready = useBoot((s) => s.ready);
  const banner = useBoot((s) => s.banner);
  const clearBanner = useBoot((s) => s.clearBanner);

  useEffect(() => {
    if (!ready) return;
    const tick = () => runRitual();
    tick();
    const id = window.setInterval(tick, 15_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [ready]);

  if (!banner) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-md bg-bg px-6 pt-safe">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <p className="text-base text-pretty">{banner}</p>
        <button
          type="button"
          className="h-11 shrink-0 text-muted"
          onClick={clearBanner}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
