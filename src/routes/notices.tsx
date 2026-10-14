import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DAWN_NOTE, DUSK_NOTE } from "@/lib/copy";
import { useApp } from "@/lib/store";
import { runRitual } from "@/components/ritual";

export const Route = createFileRoute("/notices")({
  component: Notices,
});

export function Notices() {
  const notices = useApp((s) => s.notices);
  const setNotice = useApp((s) => s.setNotice);
  const replayIntro = useApp((s) => s.replayIntro);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function toggle(kind: "dawn" | "dusk") {
    const next = !notices[kind];
    if (next && typeof Notification !== "undefined" && Notification.permission === "default") {
      setBusy(true);
      try {
        await Notification.requestPermission();
      } catch {
        /* still enable the in-app line */
      } finally {
        setBusy(false);
      }
    }
    setNotice(kind, next);
    if (next) runRitual();
  }

  return (
    <main className="reveal mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe pb-safe">
      <header className="flex h-11 items-center">
        <Link to="/" className="text-muted">
          Today
        </Link>
      </header>
      <h1 className="word mt-8 text-xl leading-none">Notices</h1>
      <p className="mt-4 text-pretty text-muted">
        These show while Morrow is open. Allow notifications if you want them
        when it is in the background.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        <NoticeCard
          title="Dawn"
          body={DAWN_NOTE}
          on={notices.dawn}
          disabled={busy}
          onToggle={() => void toggle("dawn")}
        />
        <NoticeCard
          title="Dusk"
          body={DUSK_NOTE}
          on={notices.dusk}
          disabled={busy}
          onToggle={() => void toggle("dusk")}
        />
      </div>
      <button
        type="button"
        className="mt-10 h-11 self-start text-muted"
        onClick={() => {
          replayIntro();
          void navigate({ to: "/" });
        }}
      >
        Read the introduction
      </button>
    </main>
  );
}

function NoticeCard({
  title,
  body,
  on,
  disabled,
  onToggle,
}: {
  title: string;
  body: string;
  on: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl p-4 shadow-sheet">
      <div>
        <h2 className="text-base font-medium">{title}</h2>
        <p className="mt-2 text-pretty text-muted">{body}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={title}
        disabled={disabled}
        className="switch shrink-0"
        onClick={onToggle}
      >
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
      </button>
    </div>
  );
}
