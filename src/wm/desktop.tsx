import { h, signal } from "fuse";
import { styled } from "../pmod/styled";
import { registry, PmodApp } from "../pmod/registry";

const Win = styled('div', {
  position: 'absolute', background: 'var(--bg-elev)', borderRadius: 'var(--radius-base)',
  boxShadow: 'var(--shadow-soft)', border: '1px solid rgba(255,255,255,0.03)',
  overflow: 'hidden', display: 'flex', flexDirection: 'column'
});

const Bar = styled('div', {
  height: '40px', padding: '0 var(--space-md)', display: 'flex', alignItems: 'center',
  gap: '12px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px',
  borderBottom: '1px solid rgba(255,255,255,0.03)', userSelect: 'none'
});

const Content = styled('div', { flex: '1', overflow: 'auto' });

const Close = styled('button', {
  marginLeft: 'auto', background: 'transparent', border: 'none',
  color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px',
  padding: '4px 8px', borderRadius: '4px'
});

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

function Window({ app, x, y, onClose }: { app: PmodApp; x: number; y: number; onClose: () => void }) {
  return (
    <Win style={`left:${x}px;top:${y}px;width:${app.width||400}px;height:${app.height||500}px`}>
      <Bar><span>{app.icon||'📦'}</span><span>{app.name}</span><Close onClick={onClose}>x</Close></Bar>
      <Content>{app.content()}</Content>
    </Win>
  );
}

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
