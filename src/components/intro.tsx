import { FULL_DAY, formatCount } from "@/lib/time";
import { useApp } from "@/lib/store";

export function Intro() {
  const seeIntro = useApp((s) => s.seeIntro);

  return (
    <main className="reveal mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      <header className="flex h-11 items-center">
        <h1 className="word rise text-xl leading-none">Morrow</h1>
      </header>
      <p className="balance-num rise d1 mt-14">{formatCount(FULL_DAY)}</p>
      <p className="rise d2 mt-4 text-base">Given, not carried over.</p>
      <p className="rise d3 mt-6 text-pretty text-muted">
        Picture it as dollars that reset every morning, so you would spend them.
        A day is that size in seconds. It is already being spent, including on
        sleep. The first time you look, you watch what has gone.
      </p>
      <div className="sticky bottom-0 mt-auto bg-bg pt-8 pb-safe">
        <button type="button" className="gold press" onClick={seeIntro}>
          See today
        </button>
      </div>
    </main>
  );
}
