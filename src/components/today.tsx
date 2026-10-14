import { useEffect, useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet } from "@/components/sheet";
import { DAWN_NOTE, TAGS, tagLabel, type TagId } from "@/lib/copy";
import { logFor, useApp, type Moment } from "@/lib/store";
import {
  dayKeyAt,
  figure,
  formatClock,
  formatCount,
  recentDayKeys,
  weekdayLetter,
} from "@/lib/time";
import { useNow } from "@/lib/use-now";

type Which = "name" | "moment" | "dawn" | null;

export function Today() {
  const now = useNow();
  const dawnHour = useApp((s) => s.dawnHour);
  const dawnMinute = useApp((s) => s.dawnMinute);
  const days = useApp((s) => s.days);
  const dawnOfferSeen = useApp((s) => s.dawnOfferSeen);
  const notices = useApp((s) => s.notices);
  const saveIntention = useApp((s) => s.saveIntention);
  const addMoment = useApp((s) => s.addMoment);
  const removeMoment = useApp((s) => s.removeMoment);
  const closeDay = useApp((s) => s.closeDay);
  const setDawn = useApp((s) => s.setDawn);
  const dismissDawnOffer = useApp((s) => s.dismissDawnOffer);
  const setNotice = useApp((s) => s.setNotice);

  const key = dayKeyAt(now, dawnHour, dawnMinute);
  const log = logFor(days, key);
  const balance = figure(now, log.begunAt);
  const named = log.intention.trim().length > 0;
  const [sheet, setSheet] = useState<Which>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [key]);

  const shown = showAll ? log.moments : log.moments.slice(0, 3);
  const minuteBucket = Math.floor(balance.value / 60);
  const offer = named && !dawnOfferSeen && !notices.dawn;
  const keys = recentDayKeys(now, dawnHour, dawnMinute);

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
        className="mt-8 h-11 self-start text-left text-base text-muted"
        onClick={() => setSheet("dawn")}
      >
        Refills at {formatClock(dawnHour, dawnMinute)}
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
        {formatCount(balance.value)}
      </p>
      <p className="mt-4 text-base">{balance.caption}</p>
      <p className="sr-only" aria-live="polite">
        {formatCount(minuteBucket * 60)} seconds. {balance.caption}
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
        <p className="sr-only">
          Seven dawns. An arch means the day was named. A line means rest.
        </p>
        <p className="mt-4 text-muted">Rest is part of the rhythm.</p>
      </section>

      {offer ? (
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-pretty">{DAWN_NOTE}</p>
          <p className="mt-2 text-pretty text-muted">
            At your dawn, and only when today has no name.
          </p>
          <div className="mt-3 flex gap-6">
            <button type="button" className="h-11 font-medium" onClick={() => void allowDawn()}>
              Allow it
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
        onClose={() => setSheet(null)}
        onSave={(hour, minute) => {
          setDawn(hour, minute);
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
  onClose,
  onSave,
}: {
  open: boolean;
  hour: number;
  minute: number;
  onClose: () => void;
  onSave: (hour: number, minute: number) => void;
}) {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);
  useEffect(() => {
    if (open) {
      setH(hour);
      setM(minute);
    }
  }, [open, hour, minute]);

  return (
    <Sheet open={open} title="Dawn" onClose={onClose}>
      <p className="text-pretty text-muted">The day refills at this time. Not at midnight.</p>
      <p className="nums mt-6 text-center text-3xl">{formatClock(h, m)}</p>
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <Step label="Earlier hour" onClick={() => setH((value) => (value + 23) % 24)}>
            Hour earlier
          </Step>
          <Step label="Later hour" onClick={() => setH((value) => (value + 1) % 24)}>
            Hour later
          </Step>
        </div>
        <div className="flex gap-2">
          <Step label="Earlier minutes" onClick={() => setM((value) => bumpMinute(value, -1))}>
            Minutes earlier
          </Step>
          <Step label="Later minutes" onClick={() => setM((value) => bumpMinute(value, 1))}>
            Minutes later
          </Step>
        </div>
      </div>
      <button type="button" className="gold press mt-4" onClick={() => onSave(h, m)}>
        Save dawn
      </button>
      <Link
        to="/notices"
        className="mt-2 flex h-11 items-center justify-center text-muted"
      >
        Notices
      </Link>
    </Sheet>
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
