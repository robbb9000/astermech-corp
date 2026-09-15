import { Logo } from "@/components/brand/Logo";
import { FINALE, NAV } from "@/cinematic/copy";
import { getPack } from "@/cinematic/assets";
import { cn } from "@/lib/utils";

type FinaleProps = {
  onNavigate: (target: "vision" | "products" | "contact") => void;
  onContact: () => void;
};

export function Finale({ onNavigate, onContact }: FinaleProps) {
  const pack = getPack();

  return (
    <section
      id="contact"
      className="relative z-10 flex film-panel flex-col bg-void"
    >
      <div className="relative flex flex-1 flex-col items-center justify-center px-stage-x py-24 text-center">
        <img
          src={pack.finale.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: pack.finale.objectPosition }}
        />
        <div className="absolute inset-0 bg-void/55" />
        <div className="relative flex max-w-2xl flex-col items-center">
          <Logo className="mb-8 size-14 text-fg md:size-16" />
          <h2 className="font-display text-wordmark tracking-wordmark text-fg">
            {FINALE.wordmark}
          </h2>
          <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-muted md:text-base">
            {FINALE.statement}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className={cn(
                "inline-flex h-12 min-w-44 items-center justify-center gap-3 rounded-pill border border-fg/30 px-6",
                "font-sans text-kicker tracking-nav text-fg uppercase",
                "transition-[background-color,border-color,transform] duration-150",
                "hover:border-fg hover:bg-fg hover:text-void active:scale-[0.96]",
              )}
            >
              Our Products
              <span aria-hidden>→</span>
            </button>
            <button
              type="button"
              onClick={onContact}
              className={cn(
                "inline-flex h-12 min-w-44 items-center justify-center gap-3 rounded-pill border border-fg/30 px-6",
                "font-sans text-kicker tracking-nav text-fg uppercase",
                "transition-[background-color,border-color,transform] duration-150",
                "hover:border-fg hover:bg-fg hover:text-void active:scale-[0.96]",
              )}
            >
              Get In Touch
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
      <footer className="relative z-10 border-t border-hairline bg-void px-stage-x py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-kicker tracking-nav text-dim uppercase sm:flex-row">
          <nav className="flex gap-6" aria-label="Footer">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  item.target === "contact"
                    ? onContact()
                    : onNavigate(item.target)
                }
                className="text-dim uppercase transition-colors duration-150 hover:text-fg"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} AsterMech Corp</p>
        </div>
      </footer>
    </section>
  );
}
