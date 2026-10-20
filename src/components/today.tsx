import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet } from "@/components/sheet";
import { TAGS, tagLabel, type TagId } from "@/lib/copy";
import { logFor, useApp, type Moment } from "@/lib/store";
import {
  FULL_DAY,
  dayKeyAt,
  formatClock,
  formatCount,
  purse,
  recentDayKeys,
  sleepClockFromFraction,
  weekdayLetter,
} from "@/lib/time";
import { useNow } from "@/lib/use-now";
import { useWitness, latchOpening } from "@/lib/use-witness";

type Which = "name" | "moment" | "dawn" | null;

export function Today() {
  const now = useNow();
  const dawnHour = useApp((s) => s.dawnHour);
  const dawnMinute = useApp((s) => s.dawnMinute);
  const sleepHour = useApp((s) => s.sleepHour);
  const sleepMinute = useApp((s) => s.sleepMinute);
  const seenAt = useApp((s) => s.seenAt);
  const markSeen = useApp((s) => s.markSeen);
  const days = useApp((s) => s.days);
  const dawnOfferSeen = useApp((s) => s.dawnOfferSeen);
  const notices = useApp((s) => s.notices);
  const saveIntention = useApp((s) => s.saveIntention);
  const addMoment = useApp((s) => s.addMoment);
  const removeMoment = useApp((s) => s.removeMoment);
  const closeDay = useApp((s) => s.closeDay);
  const setDawn = useApp((s) => s.setDawn);
  const setSleep = useApp((s) => s.setSleep);
  const dismissDawnOffer = useApp((s) => s.dismissDawnOffer);
  const setNotice = useApp((s) => s.setNotice);

  const key = dayKeyAt(now, dawnHour, dawnMinute);
  const log = logFor(days, key);
  const account = purse(now, dawnHour, dawnMinute, sleepHour, sleepMinute);
  const openedAt = useMemo(() => {
    if (seenAt == null) return FULL_DAY;
    const seenKey = dayKeyAt(new Date(seenAt), dawnHour, dawnMinute);
    if (seenKey !== key) return FULL_DAY;
    return purse(new Date(seenAt), dawnHour, dawnMinute, sleepHour, sleepMinute).remaining;
  }, [key, dawnHour, dawnMinute, sleepHour, sleepMinute, seenAt]);
  const from = latchOpening(key, openedAt);
  const { value, draining } = useWitness(from, account.remaining, key);
  useEffect(() => {
    const stamp = () => markSeen(Date.now());
    const onVis = () => {
      if (document.visibilityState === "hidden") stamp();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", stamp);
    return () => {
      stamp();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", stamp);
    };
  }, [markSeen]);
  const named = log.intention.trim().length > 0;
  const [sheet, setSheet] = useState<Which>(null);
  const [showAll, setShowAll] = useState(false);
  const [dragFraction, setDragFraction] = useState<number | null>(null);
  const vesselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowAll(false);
  }, [key]);

  const shown = showAll ? log.moments : log.moments.slice(0, 3);
  const minuteBucket = Math.floor(account.remaining / 60);
  const lived = FULL_DAY - value;
  const caption = draining
    ? "Already in the day."
    : account.remaining <= 0
      ? "It refills at wake."
      : account.inSleep
        ? "The night is for sleep."
        : "Still yours.";
  const sleepSeconds =
    dragFraction == null ? account.sleepSeconds : Math.round(dragFraction * FULL_DAY);
  const draggedSleep =
    dragFraction == null
      ? null
      : sleepClockFromFraction(dawnHour, dawnMinute, dragFraction);

  function fractionFromY(clientY: number): number | null {
    const rect = vesselRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return null;
    const fromBottom = (rect.bottom - clientY) / rect.height;
    return Math.min(18 / 24, Math.max(1 / 24, fromBottom));
  }

  function moveSleep(clientY: number) {
    const next = fractionFromY(clientY);
    if (next != null) setDragFraction(next);
  }

  function commitSleep(clientY: number) {
    const next = fractionFromY(clientY);
    setDragFraction(null);
    if (next == null) return;
    const clock = sleepClockFromFraction(dawnHour, dawnMinute, next);
    setSleep(clock.hour, clock.minute);
  }
  const keys = recentDayKeys(now, dawnHour, dawnMinute);
  const offer = named && !dawnOfferSeen && !notices.dawn;

  async function allowDawn() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* in-app line still works */
      }
    }
    setNotice("dawn", true);
    dismissDawnOffer();
  }

  return (
    <main className="reveal mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      <header className="flex h-11 items-center">
        <h1 className="word text-xl leading-none">Morrow</h1>
      </header>

      <button
        type="button"
        className="mt-8 self-start text-left text-base text-muted"
        onClick={() => setSheet("dawn")}
      >
        <span className="block">Refills at {formatClock(dawnHour, dawnMinute)}</span>
        <span className="mt-1 block">Sleep at {formatClock(sleepHour, sleepMinute)}</span>
      </button>

      <button
        type="button"
        className="mt-2 self-start text-left text-base text-balance"
        onClick={() => setSheet("name")}
      >
        {named ? (
          log.intention
        ) : (
          <span className="text-muted">Name what today is for.</span>
        )}
      </button>

      <p className="balance-num mt-10" aria-hidden="true">
        {formatCount(value)}
      </p>
      <div ref={vesselRef} className="vessel mt-6">
        <div className="vessel-fill" style={{ height: `${(value / FULL_DAY) * 100}%` }} />
        <button
          type="button"
          className="vessel-mark"
          style={{ bottom: `${(sleepSeconds / FULL_DAY) * 100}%` }}
          aria-label={`Sleep at ${formatClock(draggedSleep?.hour ?? sleepHour, draggedSleep?.minute ?? sleepMinute)}. Drag to move it.`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            moveSleep(event.clientY);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) moveSleep(event.clientY);
          }}
          onPointerUp={(event) => commitSleep(event.clientY)}
          onPointerCancel={() => setDragFraction(null)}
        />
      </div>
      <p className="mt-3 text-muted">
        {formatCount(lived)} already lived.{" "}
        {draggedSleep
          ? `Sleep at ${formatClock(draggedSleep.hour, draggedSleep.minute)}`
          : "Drag the line to set sleep."}
      </p>
      <p className="mt-4 text-base">{caption}</p>
      <p className="sr-only" aria-live="polite">
        {formatCount(minuteBucket * 60)} seconds. {caption}
      </p>

      <section className="mt-10">
        {log.moments.length === 0 ? (
          <p className="text-pretty text-muted">Unmarked time is still lived.</p>
        ) : (
          <>
            <ul>
              {shown.map((moment) => (
                <MomentRow
                  key={moment.id}
                  moment={moment}
                  onRemove={() => removeMoment(moment.id, now)}
                />
              ))}
            </ul>
            {log.moments.length > 3 && !showAll ? (
              <button
                type="button"
                className="mt-4 h-11 text-muted"
                onClick={() => setShowAll(true)}
              >
                Show the rest
              </button>
            ) : null}
            <p className="mt-4 text-pretty text-muted">
              What you didn't name was still lived.
            </p>
          </>
        )}
        {named || log.moments.length > 0 ? (
          log.close ? (
            <p className="mt-6 text-pretty">{log.close}</p>
          ) : (
            <button
              type="button"
              className="mt-6 h-11 text-left text-muted"
              onClick={() => closeDay(now)}
            >
              Close the day
            </button>
          )
        ) : null}
      </section>

      <section className="mt-10">
        <ol className="flex items-end justify-between" aria-hidden="true">
          {keys.map((day) => {
            const wasNamed = logFor(days, day).intention.trim().length > 0;
            return (
              <li key={day} className="flex w-8 flex-col items-center gap-2 text-fg">
                <DayMark named={wasNamed} />
                <span className="text-sm text-muted">{weekdayLetter(day)}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-muted">An arch is a day you named. A line is rest.</p>
      </section>

      {offer ? (
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-pretty">A note when the purse refills.</p>
          <p className="mt-2 text-pretty text-muted">
            It speaks only if that day has no name yet.
          </p>
          <div className="mt-3 flex gap-6">
            <button type="button" className="h-11 font-medium" onClick={() => void allowDawn()}>
              Allow the note
            </button>
            <button type="button" className="h-11 text-muted" onClick={dismissDawnOffer}>
              Not now
            </button>
          </div>
        </div>
      ) : null}

      <div className="sticky bottom-0 mt-auto bg-bg pt-8 pb-safe">
        <button
          type="button"
          className="gold press"
          onClick={() => setSheet(named ? "moment" : "name")}
        >
          {named ? "Mark a moment" : "Name today"}
        </button>
      </div>

      <NameSheet
        open={sheet === "name"}
        initial={log.intention}
        onClose={() => setSheet(null)}
        onSave={(text) => {
          saveIntention(text, now);
          setSheet(null);
        }}
      />
      <MomentSheet
        open={sheet === "moment"}
        full={log.moments.length >= 12}
        onClose={() => setSheet(null)}
        onSave={(name, tag) => {
          const ok = addMoment(name, tag, now);
          if (ok) setSheet(null);
        }}
      />
      <DawnSheet
        open={sheet === "dawn"}
        hour={dawnHour}
        minute={dawnMinute}
        sleepHour={sleepHour}
        sleepMinute={sleepMinute}
        onClose={() => setSheet(null)}
        onSave={(hour, minute, sleepH, sleepM) => {
          setDawn(hour, minute);
          setSleep(sleepH, sleepM);
          setSheet(null);
        }}
      />
    </main>
  );
}

function MomentRow({ moment, onRemove }: { moment: Moment; onRemove: () => void }) {
  return (
    <li className="flex min-h-14 items-center justify-between gap-4 border-b border-line py-3">
      <span className="min-w-0">
        <span className="block text-pretty">{moment.name}</span>
        {moment.tag ? (
          <span className="text-sm text-muted">{tagLabel(moment.tag)}</span>
        ) : null}
      </span>
      <button type="button" className="h-11 shrink-0 text-muted" onClick={onRemove}>
        Remove
      </button>
    </li>
  );
}

function DayMark({ named }: { named: boolean }) {
  if (!named) {
    return (
      <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden="true">
        <path
          d="M1 10 H19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden="true">
      <path
        d="M1 10 H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 10 A4 4 0 0 1 14 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NameSheet({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: string;
  onClose: () => void;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(initial);
  const field = useId();
  useEffect(() => {
    if (open) setText(initial);
  }, [open, initial]);

  return (
    <Sheet open={open} title="Name today" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (text.trim()) onSave(text);
        }}
      >
        <label htmlFor={field} className="text-pretty text-muted">
          One specific line. Not a quota.
        </label>
        <textarea
          id={field}
          className="field mt-4"
          rows={2}
          maxLength={80}
          value={text}
          placeholder="This afternoon, the draft"
          autoComplete="off"
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" className="gold press mt-4" disabled={!text.trim()}>
          Save
        </button>
      </form>
    </Sheet>
  );
}

function MomentSheet({
  open,
  full,
  onClose,
  onSave,
}: {
  open: boolean;
  full: boolean;
  onClose: () => void;
  onSave: (name: string, tag: TagId | null) => void;
}) {
  const [name, setName] = useState("");
  const [tag, setTag] = useState<TagId | null>(null);
  const field = useId();
  useEffect(() => {
    if (open) {
      setName("");
      setTag(null);
    }
  }, [open]);

  return (
    <Sheet open={open} title="Mark a moment" onClose={onClose}>
      {full ? (
        <p className="text-pretty text-muted">That's enough names for one day.</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim()) onSave(name, tag);
          }}
        >
          <label htmlFor={field} className="text-pretty text-muted">
            A name, not a duration. A tag is optional.
          </label>
          <textarea
            id={field}
            className="field mt-4"
            rows={2}
            maxLength={80}
            value={name}
            placeholder="The draft, lunch, a walk"
            autoComplete="off"
            onChange={(event) => setName(event.target.value)}
          />
          <div className="mt-4 flex flex-col gap-2">
            {TAGS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="pick h-14 rounded-lg px-4 text-left text-base"
                aria-pressed={tag === item.id}
                onClick={() => setTag((current) => (current === item.id ? null : item.id))}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="submit" className="gold press mt-4" disabled={!name.trim()}>
            Keep it
          </button>
        </form>
      )}
    </Sheet>
  );
}

function DawnSheet({
  open,
  hour,
  minute,
  sleepHour,
  sleepMinute,
  onClose,
  onSave,
}: {
  open: boolean;
  hour: number;
  minute: number;
  sleepHour: number;
  sleepMinute: number;
  onClose: () => void;
  onSave: (hour: number, minute: number, sleepHour: number, sleepMinute: number) => void;
}) {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);
  const [sh, setSh] = useState(sleepHour);
  const [sm, setSm] = useState(sleepMinute);
  useEffect(() => {
    if (open) {
      setH(hour);
      setM(minute);
      setSh(sleepHour);
      setSm(sleepMinute);
    }
  }, [open, hour, minute, sleepHour, sleepMinute]);

  return (
    <Sheet open={open} title="Wake and sleep" onClose={onClose}>
      <p className="text-pretty text-muted">
        The purse refills at wake, not at midnight. From sleep until the next
        wake, it is spent resting. That part is not lost, and it is not a debt.
      </p>
      <p className="mt-6 text-base">Wake</p>
      <p className="nums mt-2 text-center text-3xl">{formatClock(h, m)}</p>
      <ClockSteps
        onHour={(dir) => setH((value) => (value + dir + 24) % 24)}
        onMinute={(dir) => setM((value) => bumpMinute(value, dir))}
      />
      <p className="mt-6 text-base">Sleep</p>
      <p className="nums mt-2 text-center text-3xl">{formatClock(sh, sm)}</p>
      <ClockSteps
        onHour={(dir) => setSh((value) => (value + dir + 24) % 24)}
        onMinute={(dir) => setSm((value) => bumpMinute(value, dir))}
      />
      <button type="button" className="gold press mt-4" onClick={() => onSave(h, m, sh, sm)}>
        Save
      </button>
      <Link to="/notices" className="mt-2 flex h-11 items-center justify-center text-muted">
        Notices
      </Link>
    </Sheet>
  );
}

function ClockSteps({
  onHour,
  onMinute,
}: {
  onHour: (dir: 1 | -1) => void;
  onMinute: (dir: 1 | -1) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <Step label="Earlier hour" onClick={() => onHour(-1)}>
          Hour earlier
        </Step>
        <Step label="Later hour" onClick={() => onHour(1)}>
          Hour later
        </Step>
      </div>
      <div className="flex gap-2">
        <Step label="Earlier minutes" onClick={() => onMinute(-1)}>
          Minutes earlier
        </Step>
        <Step label="Later minutes" onClick={() => onMinute(1)}>
          Minutes later
        </Step>
      </div>
    </div>
  );
}
function bumpMinute(value: number, dir: 1 | -1): number {
  const snapped = Math.round(value / 5) * 5;
  return (snapped + dir * 5 + 60) % 60;
}

function Step({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <button type="button" aria-label={label} className="pick h-14 flex-1 rounded-lg" onClick={onClick}>
      {children}
    </button>
  );
}
