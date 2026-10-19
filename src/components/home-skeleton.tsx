export function HomeSkeleton() {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe"
      aria-busy="true"
    >
      <p className="sr-only">Loading</p>
      <header className="flex h-11 items-center">
        <h1 className="word text-xl leading-none">Morrow</h1>
      </header>
      <div className="bone mt-8 h-4 w-40" />
      <div className="bone mt-3 h-4 w-36" />
      <div className="bone mt-4 h-5 w-56" />
      <div className="bone mt-10 h-20 w-60" />
      <div className="bone mt-6 h-32 w-full" />
      <div className="bone mt-4 h-4 w-48" />
      <div className="mt-10 space-y-3">
        <div className="bone h-5 w-full" />
        <div className="bone h-5 w-4/5" />
      </div>
      <div className="mt-10 flex justify-between">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="bone h-3 w-5" />
        ))}
      </div>
      <div className="sticky bottom-0 mt-auto bg-bg pt-4 pb-safe">
        <div className="bone h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
