export const ASSEMBLY_VH = 800;
export const FRAME_COUNT = 108;
export const FRAME_PAD = 3;

export function frameSrc(index: number) {
  const i = Math.max(0, Math.min(FRAME_COUNT - 1, index));
  return `/cinematic/v1/seq/frame_${String(i).padStart(FRAME_PAD, "0")}.jpg`;
}

export function readTrackProgress(track: HTMLElement) {
  const total = track.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, -track.getBoundingClientRect().top / total));
}
