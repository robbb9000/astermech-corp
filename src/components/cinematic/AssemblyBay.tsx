import { useEffect, useRef } from "react";
import {
  ASSEMBLY_VH,
  HANGAR_SRC,
  SPRITES,
  computeAssembly,
  readTrackProgress,
} from "@/cinematic/assembly";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AssemblyBay() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const partRefs = useRef<Record<string, HTMLElement | null>>({});
  const reduced = useReducedMotion();

  useEffect(() => {
    const paint = () => {
      const track = trackRef.current;
      if (!track) return;
      const frame = computeAssembly(readTrackProgress(track), reduced);
      const rig = rigRef.current;
      if (rig) {
        rig.style.transform = `translate3d(-50%, ${frame.cameraY}%, 0) scale(${frame.cameraScale.toFixed(3)})`;
      }
      if (glowRef.current) glowRef.current.style.opacity = frame.eyes.toFixed(3);
      for (const s of frame.sprites) {
        const el = partRefs.current[s.id];
        if (!el) continue;
        el.style.opacity = s.opacity.toFixed(3);
        el.style.transform = `translate3d(${s.x.toFixed(2)}%, ${s.y.toFixed(2)}%, 0) rotate(${s.rotate.toFixed(2)}deg)`;
      }
    };
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
  }, [reduced]);

  return (
    <section
      id="assembly"
      ref={trackRef}
      className="relative bg-void-deep"
      style={{ height: `${ASSEMBLY_VH}vh` }}
      aria-label="Mech assembly"
    >
      <div className="stage-viewport sticky top-0 z-10 overflow-hidden bg-void-deep">
        <img
          src={HANGAR_SRC}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div ref={rigRef} className="assembly-rig">
          {SPRITES.map((spr) => (
            <div
              key={spr.id}
              ref={(el) => {
                partRefs.current[spr.id] = el;
              }}
              className="assembly-sprite"
              data-part={spr.id}
              style={{
                left: `${spr.left}%`,
                top: `${spr.top}%`,
                width: `${spr.width}%`,
                height: `${spr.height}%`,
                zIndex: spr.z,
                transformOrigin: spr.origin,
                opacity: spr.id === "head" ? 1 : 0,
              }}
            >
              <img src={spr.src} alt="" draggable={false} />
            </div>
          ))}
          <div ref={glowRef} className="assembly-eyes" />
        </div>
        <div className="stage-vignette pointer-events-none absolute inset-0" />
      </div>
    </section>
  );
}
