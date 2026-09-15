import { useEffect, useRef } from "react";
import {
  ASSEMBLY_VH,
  FRAME_COUNT,
  frameSrc,
  readTrackProgress,
} from "@/cinematic/assembly";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const WINDOW = 10;

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  cw: number,
  ch: number,
  iw: number,
  ih: number,
) {
  const ir = iw / ih;
  const cr = cw / ch;
  let dw = cw;
  let dh = ch;
  if (cr > ir) {
    dw = cw;
    dh = cw / ir;
  } else {
    dh = ch;
    dw = ch * ir;
  }
  ctx.fillStyle = "#05070c";
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

export function AssemblyBay() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const current = useRef(0);
  const target = useRef(0);
  const bitmaps = useRef<Map<number, ImageBitmap>>(new Map());
  const loading = useRef<Set<number>>(new Set());
  const drawn = useRef(-1);

  useEffect(() => {
    let alive = true;
    let raf = 0;

    const load = async (index: number) => {
      if (!alive) return;
      const i = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      if (bitmaps.current.has(i) || loading.current.has(i)) return;
      loading.current.add(i);
      try {
        const res = await fetch(frameSrc(i));
        const blob = await res.blob();
        const bmp = await createImageBitmap(blob);
        if (!alive) {
          bmp.close();
          return;
        }
        bitmaps.current.set(i, bmp);
      } catch {
        /* skip missing frame */
      } finally {
        loading.current.delete(i);
      }
    };

    const prune = (center: number) => {
      for (const [k, bmp] of bitmaps.current) {
        if (Math.abs(k - center) > WINDOW) {
          bmp.close();
          bitmaps.current.delete(k);
        }
      }
    };

    const nearest = (want: number) => {
      if (bitmaps.current.has(want)) return want;
      let best = -1;
      let dist = 999;
      for (const k of bitmaps.current.keys()) {
        const d = Math.abs(k - want);
        if (d < dist) {
          dist = d;
          best = k;
        }
      }
      return best;
    };

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxW = w <= 800 ? 960 : 1280;
      const scale = Math.min(1, maxW / Math.max(1, w));
      canvas.width = Math.round(w * dpr * scale);
      canvas.height = Math.round(h * dpr * scale);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      drawn.current = -1;
    };

    const paint = () => {
      const track = trackRef.current;
      const canvas = canvasRef.current;
      if (!track || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const t = reduced ? 1 : readTrackProgress(track);
      target.current = t * (FRAME_COUNT - 1);
      const k = reduced ? 1 : 0.22;
      current.current += (target.current - current.current) * k;
      if (Math.abs(target.current - current.current) < 0.02) current.current = target.current;
      const want = Math.round(current.current);
      for (let i = want - 4; i <= want + 6; i++) load(i);
      prune(want);
      const have = nearest(want);
      if (have >= 0 && have !== drawn.current) {
        const bmp = bitmaps.current.get(have);
        if (bmp) {
          drawCover(ctx, bmp, canvas.width, canvas.height, bmp.width, bmp.height);
          drawn.current = have;
        }
      }
    };

    const tick = () => {
      paint();
      raf = requestAnimationFrame(tick);
    };

    resize();
    for (let i = 0; i < 12; i++) load(i);
    window.addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      for (const bmp of bitmaps.current.values()) bmp.close();
      bitmaps.current.clear();
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
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="stage-vignette pointer-events-none absolute inset-0" />
      </div>
    </section>
  );
}
