import { h } from "fuse";
import { PmodApp } from "../pmod/registry";
import { styled } from "../pmod";

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

export function Window({ app, x, y, onClose }: { app: PmodApp; x: number; y: number; onClose: () => void }) {
  return (
    <Win style={`left:${x}px;top:${y}px;width:${app.width||400}px;height:${app.height||500}px`}>
      <Bar><span>{app.icon||'📦'}</span><span>{app.name}</span><Close onClick={onClose}>x</Close></Bar>
      <Content>{app.content()}</Content>
    </Win>
  );
}