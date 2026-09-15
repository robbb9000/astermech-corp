import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { JourneyShowcase } from "@/components/cinematic/JourneyShowcase";
import { PRODUCT } from "@/cinematic/copy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/journey")({ component: JourneyPage });

function JourneyPage() {
  return (
    <div className="min-h-dvh bg-void text-fg">
      <header className="flex items-center justify-between px-stage-x pt-[max(0.9rem,env(safe-area-inset-top))] pb-4">
        <Link to="/" className="flex items-center gap-3 text-fg">
          <Logo className="size-7" />
          <span className="font-display text-kicker tracking-wordmark">ASTERMECH</span>
        </Link>
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 font-sans text-kicker tracking-nav text-muted uppercase hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </header>
      <main>
        <JourneyShowcase />
        <section className="mx-auto max-w-2xl px-stage-x pb-24 text-center">
          <p className="text-pretty text-sm leading-relaxed text-muted md:text-base">
            Journey is AsterMech's first product — a focused fitness tracker
            for routines, daily progress, and showing up again tomorrow. More
            from the studio will follow.
          </p>
          <Link
            to="/"
            hash="contact"
            className={cn(
              "mt-8 inline-flex h-12 items-center gap-3 rounded-pill border border-fg/30 px-6",
              "font-sans text-kicker tracking-nav text-fg uppercase",
              "hover:border-fg hover:bg-fg hover:text-void",
            )}
          >
            Get in touch
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-10 font-sans text-kicker tracking-nav text-dim uppercase">
            {PRODUCT.footnote}
          </p>
        </section>
      </main>
    </div>
  );
}
