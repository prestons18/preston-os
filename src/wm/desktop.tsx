import { h, signal } from "fuse";
import { styled } from "../pmod/styled";
import { registry, PmodApp } from "../pmod/registry";

const Dock = styled('div', {
  position: 'fixed', bottom: 'var(--space-md)', left: '50%', transform: 'translateX(-50%)',
  display: 'flex', gap: 'var(--space-sm)', padding: 'var(--space-sm)',
  background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
  borderRadius: 'var(--radius-soft)', border: '1px solid rgba(255,255,255,0.06)'
});

const Icon = styled('button', {
  width: '56px', height: '56px', background: 'var(--bg-soft)',
  border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-base)',
  fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
});

export function Desktop() {
  const wins = signal<{ id: string; app: string; x: number; y: number }[]>([]);
  const apps = registry.list();

  const open = (name: string) => {
    if (wins.get().find(w => w.app === name)) return;
    const n = wins.get().length;
    wins.set([...wins.get(), { id: `${name}-${Date.now()}`, app: name, x: 100+n*30, y: 80+n*30 }]);
  };

  return (
    <div style="width:100vw;height:100vh;background:var(--bg-deep);position:relative;overflow:hidden">
      {() => wins.get().map(w => {
        const app = registry.get(w.app);
        return app ? <Window app={app} x={w.x} y={w.y} onClose={() => wins.set(wins.get().filter(x => x.id !== w.id))} /> : null;
      })}
      <Dock>{apps.map(app => <Icon onClick={() => open(app.name)} title={app.name}>{app.icon||'📦'}</Icon>)}</Dock>
    </div>
  );
}
