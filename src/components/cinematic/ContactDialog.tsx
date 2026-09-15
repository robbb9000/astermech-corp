import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const titleId = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstField.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-dialog flex items-end justify-center md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-void/80"
        aria-label="Close contact"
        onClick={onClose}
      />
      <div className="relative m-stage-y w-full max-w-lg rounded-lg border border-hairline bg-void-deep p-8 shadow-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex size-11 items-center justify-center text-muted transition-colors duration-150 hover:text-fg"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <p className="font-sans text-kicker tracking-kicker text-signal uppercase">
          Contact
        </p>
        <h2
          id={titleId}
          className="mt-3 font-display text-section tracking-wordmark text-fg"
        >
          GET IN TOUCH
        </h2>
        {sent ? (
          <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted">
            Thanks — we received your note. A small team reads every message.
          </p>
        ) : (
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="block">
              <span className="mb-2 block text-kicker tracking-nav text-muted uppercase">
                Name
              </span>
              <input
                ref={firstField}
                required
                name="name"
                autoComplete="name"
                className="h-11 w-full rounded-md border border-hairline bg-void px-3 text-sm text-fg outline-none focus:border-fg/40"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-kicker tracking-nav text-muted uppercase">
                Email
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="h-11 w-full rounded-md border border-hairline bg-void px-3 text-sm text-fg outline-none focus:border-fg/40"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-kicker tracking-nav text-muted uppercase">
                Message
              </span>
              <textarea
                required
                name="message"
                rows={4}
                className="w-full resize-none rounded-md border border-hairline bg-void px-3 py-2 text-sm leading-relaxed text-fg outline-none focus:border-fg/40"
              />
            </label>
            <button
              type="submit"
              className={cn(
                "mt-2 inline-flex h-12 items-center justify-center rounded-pill border border-fg/30 px-6",
                "font-sans text-kicker tracking-nav text-fg uppercase",
                "transition-[background-color,border-color,transform] duration-150",
                "hover:border-fg hover:bg-fg hover:text-void active:scale-[0.96]",
              )}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
