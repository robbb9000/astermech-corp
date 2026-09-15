import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ContactDialog } from "@/components/cinematic/ContactDialog";
import { Finale } from "@/components/cinematic/Finale";
import { JourneyShowcase } from "@/components/cinematic/JourneyShowcase";
import { NavBar } from "@/components/cinematic/NavBar";
import { PhoneFilm } from "@/components/cinematic/PhoneFilm";
import { getPack } from "@/cinematic/assets";
import { LANDING_SUBTITLE, LANDING_WORDMARK, SCENE_COPY, SCROLL_HINT } from "@/cinematic/copy";
import {
  BEAT_ORDER,
  CINEMATIC_VH,
  computeFrame,
  progressForBeat,
  scrollYForProgress,
  type BeatId,
  type FrameState,
  type LayerState,
} from "@/cinematic/timeline";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function readProgress(track: HTMLElement) {
  const total = track.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, -track.getBoundingClientRect().top / total));
}

function applyFrame(
  frame: FrameState,
  layerEls: Record<string, HTMLImageElement | null>,
  copyEls: Record<string, HTMLElement | null>,
  landingEl: HTMLElement | null,
  hintEl: HTMLElement | null,
  glowEl: HTMLElement | null,
  railEls: Array<HTMLElement | null>,
) {
  for (const layer of frame.layers) {
    const el = layerEls[layer.id];
    if (!el) continue;
    el.style.opacity = layer.opacity.toFixed(3);
    el.style.transform = `translate3d(0, ${layer.y.toFixed(2)}%, 0) scale(${layer.scale.toFixed(4)})`;
  }
  for (const [id, op] of Object.entries(frame.copy)) {
    const el = copyEls[id];
    if (!el) continue;
    el.style.opacity = op.toFixed(3);
    el.style.visibility = op > 0.01 ? "visible" : "hidden";
  }
  if (landingEl) {
    landingEl.style.opacity = frame.landingOpacity.toFixed(3);
    landingEl.style.visibility = frame.landingOpacity > 0.01 ? "visible" : "hidden";
  }
  if (hintEl) hintEl.style.opacity = frame.scrollHint.toFixed(3);
  if (glowEl) glowEl.style.opacity = (frame.eyesGlow * 0.55).toFixed(3);
  railEls.forEach((el, i) => {
    if (!el) return;
    el.dataset.active = i === frame.railIndex ? "true" : "false";
  });
}

function DesktopFilm() {
  const trackRef = useRef<HTMLDivElement>(null);
  const layerEls = useRef<Record<string, HTMLImageElement | null>>({});
  const copyEls = useRef<Record<string, HTMLElement | null>>({});
  const landingEl = useRef<HTMLDivElement>(null);
  const hintEl = useRef<HTMLDivElement>(null);
  const glowEl = useRef<HTMLDivElement>(null);
  const railEls = useRef<Array<HTMLElement | null>>([]);
  const liveRef = useRef<string[]>(["landing"]);
  const lastFrame = useRef<FrameState | null>(null);
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showMark, setShowMark] = useState(false);
  const [liveIds, setLiveIds] = useState<string[]>(["landing", "awaken"]);
  const pack = getPack();

  const allLayers = useMemo(
    () => [
      { id: "landing", plate: pack.landing },
      { id: "awaken", plate: pack.awaken },
      ...pack.assembly.map((plate, i) => ({ id: `assembly-${i}`, plate })),
      { id: "build", plate: pack.build },
      { id: "activate-dark", plate: pack.activateDark },
      { id: "activate", plate: pack.activate },
      { id: "launch", plate: pack.launch },
      { id: "beyond", plate: pack.beyond },
      { id: "arrival", plate: pack.arrival },
      { id: "observation", plate: pack.observation },
      { id: "vision", plate: pack.vision },
    ],
    [pack],
  );

  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const p = readProgress(track);
    const frame = computeFrame(p, reduced);
    lastFrame.current = frame;
    applyFrame(
      frame,
      layerEls.current,
      copyEls.current,
      landingEl.current,
      hintEl.current,
      glowEl.current,
      railEls.current,
    );
    const next = frame.layers.filter((l) => l.opacity > 0.02).map((l) => l.id);
    if (next.length === 0) next.push("landing");
    const prev = liveRef.current;
    const same = next.length === prev.length && next.every((id, i) => id === prev[i]);
    if (!same) {
      liveRef.current = next;
      setLiveIds(next);
    }
    setShowMark(window.scrollY > 80);
    return p;
  }, [reduced]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    paint();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [paint]);

  const goTo = useCallback(
    (target: "vision" | "products" | "contact") => {
      setMenuOpen(false);
      if (target === "products" || target === "contact") {
        document.getElementById(target)?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
        });
        return;
      }
      const track = trackRef.current;
      if (!track) return;
      window.scrollTo({
        top: scrollYForProgress(track, progressForBeat("vision")),
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  const mounted = allLayers.filter(
    (layer) => liveIds.includes(layer.id) || layer.id === "landing",
  );

  const layerStyle = (id: string, fallbackOpacity: number) => {
    const layer: LayerState | undefined = lastFrame.current?.layers.find((l) => l.id === id);
    return {
      opacity: layer ? layer.opacity : fallbackOpacity,
      transform: layer
        ? `translate3d(0, ${layer.y}%, 0) scale(${layer.scale})`
        : "translate3d(0,0,0) scale(1)",
    };
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
        showMark={showMark}
      />

      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${CINEMATIC_VH}vh` }}
      >
        <div className="stage-viewport sticky top-0 overflow-hidden bg-void-deep">
          {mounted.map((layer) => (
            <img
              key={layer.id}
              ref={(el) => {
                layerEls.current[layer.id] = el;
              }}
              src={layer.plate.src}
              alt=""
              draggable={false}
              decoding="async"
              fetchPriority={layer.id === "landing" ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: layer.plate.objectPosition,
                ...layerStyle(layer.id, layer.id === "landing" ? 1 : 0),
              }}
            />
          ))}

          <div
            ref={glowEl}
            className="pointer-events-none absolute top-[36%] left-1/2 h-16 w-40 -translate-x-1/2 rounded-full bg-signal blur-3xl"
            style={{ opacity: 0 }}
          />

          <div className="stage-vignette pointer-events-none absolute inset-0" />

          <div
            ref={landingEl}
            className="absolute inset-0 flex flex-col items-center justify-center px-stage-x text-center"
          >
            <Logo className="mb-7 size-12 text-fg md:size-14" />
            <h1 className="font-display text-wordmark tracking-wordmark text-fg">
              {LANDING_WORDMARK}
            </h1>
            <p className="mt-4 font-sans text-kicker tracking-kicker text-muted uppercase">
              {LANDING_SUBTITLE}
            </p>
          </div>

          {SCENE_COPY.map((scene) => (
            <div
              key={scene.id}
              ref={(el) => {
                copyEls.current[scene.id] = el;
              }}
              className="stage-copy pointer-events-none"
              style={{ opacity: 0, visibility: "hidden" }}
            >
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
          ))}

          <div
            ref={hintEl}
            className="absolute bottom-[max(1.6rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <span className="font-sans text-kicker tracking-kicker text-muted uppercase">
              {SCROLL_HINT}
            </span>
            <span className="block h-8 w-px bg-fg/40" />
          </div>

          <ol className="stage-rail" aria-hidden>
            {BEAT_ORDER.map((id: BeatId, i) => (
              <li
                key={id}
                ref={(el) => {
                  railEls.current[i] = el;
                }}
                data-active={i === 0 ? "true" : "false"}
              >
                {String(i + 1).padStart(2, "0")}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <JourneyShowcase />
      <Finale onNavigate={goTo} onContact={() => setContactOpen(true)} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

export function Experience() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return desktop ? <DesktopFilm /> : <PhoneFilm />;
}
