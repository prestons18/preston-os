import { signal } from "fuse";

export const isMobile = signal(window.innerWidth < 768);

export function addResizeListener(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}