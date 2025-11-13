import { signal } from "fuse";

// Platform detection
export const isMobile = signal(window.innerWidth < 768);

window.addEventListener('resize', () => {
  isMobile.set(window.innerWidth < 768);
});