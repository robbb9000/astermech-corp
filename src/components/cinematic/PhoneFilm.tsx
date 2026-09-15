import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { ContactDialog } from "@/components/cinematic/ContactDialog";
import { Finale } from "@/components/cinematic/Finale";
import { JourneyShowcase } from "@/components/cinematic/JourneyShowcase";
import { NavBar } from "@/components/cinematic/NavBar";
import { getPack, type Plate } from "@/cinematic/assets";
import {
  LANDING_SUBTITLE,
  LANDING_WORDMARK,
  SCENE_COPY,
  SCROLL_HINT,
} from "@/cinematic/copy";
import { cn } from "@/lib/utils";

type Panel = {
  id: string;
  plate: Plate;
  copyId?: string;
};

function PanelCopy({ copyId }: { copyId: string }) {
  const scene = SCENE_COPY.find((item) => item.id === copyId);
  if (!scene) return null;
  return (
    <div className="stage-copy film-copy">
      {scene.kicker ? (
        <p className="mb-5 font-sans text-kicker tracking-kicker text-muted uppercase">
          {scene.kicker}
        </p>
      ) : null}
      <h2 className="cinematic-title text-cinematic text-fg">
        {scene.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <span className="mt-5 block h-px w-8 bg-signal" />
      {scene.body ? (
        <p className="mt-6 max-w-sm text-pretty text-sm leading-relaxed text-muted">
          {scene.body}
        </p>
      ) : null}
    </div>
  );
}

function Scene({
  id,
  plate,
  copyId,
  children,
  inViewDefault = false,
}: {
  id?: string;
  plate: Plate;
  copyId?: string;
  children?: ReactNode;
  inViewDefault?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(inViewDefault);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.28 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={cn("film-panel", inView && "is-in")}
      style={{
        backgroundColor: "#05070c",
        backgroundImage: `url(${plate.src})`,
        backgroundSize: "cover",
        backgroundPosition: plate.objectPosition,
      }}
    >
      <img
        src={plate.src}
        alt=""
        decoding="async"
        className={cn("absolute inset-0 h-full w-full object-cover", inView && "film-ken")}
        style={{ objectPosition: plate.objectPosition }}
      />
      <div className="stage-vignette pointer-events-none absolute inset-0" />
      {copyId ? <PanelCopy copyId={copyId} /> : null}
      {children}
    </section>
  );
}

export function PhoneFilm() {
  const pack = getPack();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const panels: Panel[] = [
    { id: "awaken", plate: pack.awaken, copyId: "awaken" },
    { id: "assembly-start", plate: pack.assembly[0] },
    { id: "assembly", plate: pack.assembly[1], copyId: "assembly" },
    { id: "activate", plate: pack.activate, copyId: "activate" },
    { id: "build", plate: pack.build, copyId: "build" },
    { id: "launch", plate: pack.launch, copyId: "launch" },
    { id: "observation", plate: pack.observation, copyId: "observation" },
    { id: "vision", plate: pack.vision, copyId: "vision" },
  ];

  const goTo = (target: "vision" | "products" | "contact") => {
    setMenuOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="top" className="bg-void text-fg">
      <a
        href="#products"
        className="sr-only focus:not-sr-only focus:absolute focus:z-skip focus:m-4 focus:bg-void focus:px-4 focus:py-2"
      >
        Skip to products
      </a>

      <NavBar
        menuOpen={menuOpen}
        onMenu={setMenuOpen}
        onNavigate={goTo}
        showMark
      />

      <Scene plate={pack.landing} inViewDefault>
        <div
          className="film-title relative flex min-h-[640px] flex-col items-center justify-center px-6 py-24 text-center"
          style={{ color: "#f4f6f8" }}
        >
          <Logo className="mb-7 size-12 text-fg" />
          <h1
            className="font-display text-wordmark tracking-wordmark"
            style={{ color: "#f4f6f8", letterSpacing: "0.42em" }}
          >
            {LANDING_WORDMARK}
          </h1>
          <p
            className="mt-4 font-sans text-kicker tracking-kicker uppercase"
            style={{ color: "#8b919a" }}
          >
            {LANDING_SUBTITLE}
          </p>
        </div>
        <div className="film-hint absolute bottom-[max(1.6rem,env(safe-area-inset-bottom))] left-1/2 flex flex-col items-center gap-2">
          <span className="font-sans text-kicker tracking-kicker text-muted uppercase">
            {SCROLL_HINT}
          </span>
          <span className="block h-8 w-px bg-fg/40" />
        </div>
      </Scene>

      {panels.map((panel) => (
        <Scene
          key={panel.id}
          id={panel.id}
          plate={panel.plate}
          copyId={panel.copyId}
        />
      ))}

      <JourneyShowcase />
      <Finale onNavigate={goTo} onContact={() => setContactOpen(true)} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
