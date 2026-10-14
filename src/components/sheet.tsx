import { useEffect, useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={cn(!open && "pointer-events-none")}>
      <button
        type="button"
        aria-label="Dismiss"
        tabIndex={open ? 0 : -1}
        className={cn(
          "fixed inset-0 z-40 bg-scrim transition-opacity duration-200 ease-out",
          open ? "opacity-100" : "opacity-0 duration-150",
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby={titleId}
        inert={!open ? true : undefined}
        className={cn(
          "panel fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-3xl p-4 pb-safe transition-[transform,opacity] duration-200 ease-out",
          open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 duration-150",
        )}
      >
        <h2 id={titleId} className="text-base font-medium">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
