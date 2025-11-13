import { signal } from "@prestonarnold/fuse";

export function spring(initial: any, stiffness = 300, damping = 50) {
  const val = signal(initial);
  let target = initial;
  let vel: any = typeof initial === 'number' ? 0 : Object.keys(initial).reduce((a, k) => ({ ...a, [k]: 0 }), {});
  let raf: number | null = null;

  const tick = () => {
    const curr = val.get();
    let done = true;

    if (typeof target === 'number') {
      const delta = target - curr;
      const force = delta * stiffness - vel * damping;
      vel += force * 0.016;
      const next = curr + vel * 0.016;
      if (Math.abs(delta) > 0.01 || Math.abs(vel) > 0.01) {
        done = false;
        val.set(next);
      } else {
        val.set(target);
      }
    } else {
      const next: any = {};
      for (const k in target) {
        const delta = target[k] - curr[k];
        const force = delta * stiffness - vel[k] * damping;
        vel[k] += force * 0.016;
        next[k] = curr[k] + vel[k] * 0.016;
        if (Math.abs(delta) > 0.01 || Math.abs(vel[k]) > 0.01) done = false;
        else next[k] = target[k];
      }
      val.set(next);
    }

    if (!done) raf = requestAnimationFrame(tick);
    else raf = null;
  };

  return {
    get: () => val.get(),
    set: (v: any) => {
      target = v;
      if (!raf) raf = requestAnimationFrame(tick);
    }
  };
}