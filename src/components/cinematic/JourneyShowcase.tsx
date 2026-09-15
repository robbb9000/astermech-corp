import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { PRODUCT } from "@/cinematic/copy";
import { cn } from "@/lib/utils";

const TODAY = [
  "Workout",
  "Nutrition",
  "Cardio",
  "Water",
  "Sleep",
] as const;

const BARS = [0.45, 0.62, 0.5, 0.78, 0.7, 0.88, 0.6];

function PhoneShell({
  children,
  tilt,
}: {
  children: ReactNode;
  tilt: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-[min(44vw,230px)] shrink-0 rounded-[2.1rem] bg-void p-[6px]",
        "shadow-[0_30px_80px_rgb(0_0_0_/_0.55)] ring-1 ring-fg/12",
        tilt === "left"
          ? "md:-translate-y-2 md:-rotate-6"
          : "md:translate-y-6 md:rotate-6",
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[1.7rem] bg-phone">
        <div className="absolute top-2 left-1/2 z-10 h-5 w-[4.5rem] -translate-x-1/2 rounded-pill bg-void-deep" />
        {children}
      </div>
    </div>
  );
}

function TodayPhone() {
  return (
    <PhoneShell tilt="left">
      <div className="flex h-full flex-col px-4 pt-10 pb-5">
        <p className="text-phone tracking-nav text-muted uppercase">Today</p>
        <ul className="mt-5 flex flex-1 flex-col gap-3">
          {TODAY.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between rounded-lg bg-phone-elevated px-3 py-2.5"
            >
              <span className="text-phone text-fg/90">{item}</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-journey text-void">
                <Check className="size-3" strokeWidth={3} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PhoneShell>
  );
}

function ProgressPhone() {
  return (
    <PhoneShell tilt="right">
      <div className="flex h-full flex-col px-4 pt-10 pb-5">
        <p className="text-phone tracking-nav text-muted uppercase">Progress</p>
        <div className="mt-4 flex gap-1 text-phone-xs tracking-nav uppercase">
          <span className="rounded-pill bg-fg px-2 py-1 text-void">Week</span>
          <span className="rounded-pill px-2 py-1 text-dim">Month</span>
          <span className="rounded-pill px-2 py-1 text-dim">Year</span>
        </div>
        <div className="mt-5 flex flex-1 items-end gap-1.5 px-1">
          {BARS.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-journey/90"
                style={{ height: `${Math.round(h * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-phone-elevated px-2.5 py-2">
            <p className="text-phone-xs tracking-nav text-muted uppercase">
              Consistency
            </p>
            <p className="mt-1 font-sans text-lg tabular-nums text-fg">88%</p>
          </div>
          <div className="rounded-lg bg-phone-elevated px-2.5 py-2">
            <p className="text-phone-xs tracking-nav text-muted uppercase">Streak</p>
            <p className="mt-1 font-sans text-lg tabular-nums text-fg">12</p>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

export function JourneyShowcase() {
  return (
    <section
      id="products"
      className="relative z-10 bg-void px-stage-x pt-24 pb-28 md:pt-32 md:pb-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="font-sans text-kicker tracking-kicker text-muted uppercase">
            {PRODUCT.kicker}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-phone-elevated ring-1 ring-hairline">
              <svg viewBox="0 0 32 32" className="size-7 text-fg" aria-hidden>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M16 5 L28 27 H4 Z M16 12.5 L21.2 23 H10.8 Z"
                />
              </svg>
            </span>
            <h2 className="font-display text-cinematic tracking-wordmark text-fg">
              {PRODUCT.name}
            </h2>
          </div>
          <p className="mt-5 font-sans text-xl font-light text-fg/90 md:text-2xl">
            {PRODUCT.tagline}
          </p>
          <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-muted md:text-base">
            {PRODUCT.description}
          </p>
          <Link
            to="/journey"
            className={cn(
              "mt-8 inline-flex h-12 items-center gap-3 rounded-pill border border-fg/30 px-6",
              "font-sans text-kicker tracking-nav text-fg uppercase",
              "transition-[background-color,border-color,transform] duration-150",
              "hover:border-fg hover:bg-fg hover:text-void active:scale-[0.96]",
            )}
          >
            {PRODUCT.cta}
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-6 text-kicker tracking-nav text-dim uppercase">
            {PRODUCT.footnote}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 md:gap-6">
          <TodayPhone />
          <ProgressPhone />
        </div>
      </div>
    </section>
  );
}
