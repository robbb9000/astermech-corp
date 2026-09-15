import { useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NAV } from "@/cinematic/copy";
import { cn } from "@/lib/utils";

type NavBarProps = {
  menuOpen: boolean;
  onMenu: (open: boolean) => void;
  onNavigate: (target: "vision" | "products" | "contact") => void;
  showMark: boolean;
};

export function NavBar({ menuOpen, onMenu, onNavigate, showMark }: NavBarProps) {
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, onMenu]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className="flex items-center justify-between px-stage-x pt-[max(0.9rem,env(safe-area-inset-top))] pb-3"
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 text-fg transition-opacity duration-500",
              showMark ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Logo className="size-7" />
            <span className="hidden font-display text-kicker tracking-wordmark sm:inline">
              ASTERMECH
            </span>
          </a>
          <nav
            className="pointer-events-auto hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.target)}
                className="font-sans text-kicker tracking-nav text-fg/85 uppercase transition-colors duration-150 hover:text-fg"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="pointer-events-auto flex size-11 items-center justify-center text-fg md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => onMenu(!menuOpen)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-void/95 px-stage-x pt-24 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.target);
                onMenu(false);
              }}
              className="border-b border-hairline py-5 text-left font-sans text-xl tracking-nav text-fg uppercase"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
