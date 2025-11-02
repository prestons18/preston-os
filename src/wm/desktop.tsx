import { h, signal, For } from "fuse";
import { styled } from "../pmod/styled";
import { registry, widgetRegistry } from "../pmod/registry";
import { Icon } from "../pmod";
import { AppWindow } from "./window";
import "../widgets/prsston";

const Dock = styled('div', {
  position: 'fixed',
  bottom: 'var(--space-md)',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm)',
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(12px)',
  borderRadius: 'var(--radius-soft)',
  border: '1px solid rgba(255, 255, 255, 0.06)'
});

const DockIcon = styled('button', {
  width: '56px',
  height: '56px',
  background: 'var(--bg-soft)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: 'var(--radius-base)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

type WindowState = {
  key: string;
  id: string;
  app: string;
  x: number;
  y: number;
  props?: any;
};

// Global window state
const wins = signal<WindowState[]>([]);

// Global function to open apps
export function openApp(name: string, props?: any) {
  const n = wins.get().length;
  const id = `${name}-${Date.now()}`;

  wins.set([
    ...wins.get(),
    {
      key: id,
      id: id,
      app: name,
      x: 100 + n * 30,
      y: 80 + n * 30,
      props
    }
  ]);
}

export function Desktop() {
  const apps = registry.list();
  const widgets = widgetRegistry.list();

  const open = (name: string) => {
    if (wins.get().find(w => w.app === name)) return;
    openApp(name);
  };

  return (
    <div style="width: 100vw; height: 100vh; background: var(--bg-deep); position: relative; overflow: hidden;">
      {For({
        each: () => wins.get(),
        children: [(w) => {
          const app = registry.get(w.app);
          if (!app) return document.createTextNode('');

          return (
            <AppWindow
              app={app}
              x={w.x}
              y={w.y}
              props={w.props}
              onClose={() => wins.set(wins.get().filter(x => x.id !== w.id))}
            />
          );
        }]
      })}

      {widgets.map((widget, idx) => widget.content({ x: window.innerWidth - 340, y: 20 + idx * 420 }))} 

      <Dock>
        {apps.filter(app => app.showInDock !== false).map(app => (
          <DockIcon onClick={() => open(app.name)} title={app.name}>
            {app.icon ? (
              <Icon name={app.icon} size={28} />
            ) : (
              <Icon name="Package" size={28} />
            )}
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}