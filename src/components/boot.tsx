import { useEffect, type ReactNode } from "react";
import { HomeSkeleton } from "@/components/home-skeleton";
import { Ritual } from "@/components/ritual";
import { useApp, useBoot } from "@/lib/store";

export function Boot({ children }: { children: ReactNode }) {
  const ready = useBoot((s) => s.ready);

  useEffect(() => {
    let cancel = false;
    const hyd = Promise.resolve(useApp.persist.rehydrate());
    hyd.finally(() => {
      if (cancel) return;
      useBoot.getState().setReady(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  if (!ready) return <HomeSkeleton />;
  return (
    <>
      <Ritual />
      {children}
    </>
  );
}
