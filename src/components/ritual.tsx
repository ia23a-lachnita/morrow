import { useEffect } from "react";
import { DAWN_NOTE, DUSK_NOTE } from "@/lib/copy";
import { useApp, useBoot, logFor } from "@/lib/store";
import { dayBounds, dayKeyAt } from "@/lib/time";

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
  const { dawnHour, dawnMinute } = state;
  const key = dayKeyAt(now, dawnHour, dawnMinute);
  const { start, end } = dayBounds(now, dawnHour, dawnMinute);
  const elapsed = (now.getTime() - start.getTime()) / 1000;
  const remaining = (end.getTime() - now.getTime()) / 1000;
  const log = logFor(state.days, key);
  const fired = state.fired[key] ?? {};
  const named = log.intention.trim().length > 0;

  if (state.notices.dawn && !named && elapsed <= 20 * 60 && !fired.dawn) {
    state.markFired(key, "dawn");
    deliver(DAWN_NOTE);
    return;
  }

  if (
    state.notices.dusk &&
    remaining <= 2 * 60 * 60 &&
    remaining >= 15 * 60 &&
    !fired.dusk
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
