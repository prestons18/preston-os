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
  zIndex: number;
  minimised: boolean;
  props?: any;
};

// Global window state
const wins = signal<WindowState[]>([]);
let highestZIndex = 100;
const zIndexMap = new Map<string, ReturnType<typeof signal<number>>>();
const minimisedMap = new Map<string, ReturnType<typeof signal<boolean>>>();

// Global function to open apps
export function openApp(name: string, props?: any) {
  const n = wins.get().length;
  const id = `${name}-${Date.now()}`;
  highestZIndex++;
  
  zIndexMap.set(id, signal(highestZIndex));
  minimisedMap.set(id, signal(false));

  wins.set([
    ...wins.get(),
    {
      key: id,
      id: id,
      app: name,
      x: 100 + n * 30,
      y: 80 + n * 30,
      zIndex: highestZIndex,
      minimised: false,
      props
    }
  ]);
}

// Bring window to front
function bringToFront(id: string) {
  const zIndexSignal = zIndexMap.get(id);
  const minimisedSignal = minimisedMap.get(id);
  if (!zIndexSignal || !minimisedSignal) return;
  
  // Unminimise the window first
  minimisedSignal.set(false);
  
  // Update the z-index to bring to front
  highestZIndex++;
  zIndexSignal.set(highestZIndex);
}

// Toggle minimise state
function toggleMinimise(id: string) {
  const minimisedSignal = minimisedMap.get(id);
  if (!minimisedSignal) return;
  
  const isMinimised = minimisedSignal.get();
  if (isMinimised) {
    // Restore and bring to front
    bringToFront(id);
  } else {
    // Minimise
    minimisedSignal.set(true);
  }
}

export function Desktop() {
  const apps = registry.list();
  const widgets = widgetRegistry.list();

  const handleDockClick = (appName: string) => {
    const allWindows = wins.get();
    const existingWindows = allWindows.filter(w => w.app === appName);
    
    if (existingWindows.length > 0) {
      // Get the most recently used window for this app
      const existingWin = existingWindows.reduce((prev, current) => {
        const prevZ = zIndexMap.get(prev.id)?.get() || 0;
        const currentZ = zIndexMap.get(current.id)?.get() || 0;
        return (prevZ > currentZ) ? prev : current;
      });
      
      const minimisedSignal = minimisedMap.get(existingWin.id);
      if (!minimisedSignal) return;
      
      if (minimisedSignal.get()) {
        // If window is minimised, unminimise and bring to front
        bringToFront(existingWin.id);
      } else {
        // If window is not minimised, check if it's already the top window
        const currentZ = zIndexMap.get(existingWin.id)?.get() || 0;
        const maxZ = Math.max(...allWindows.map(w => zIndexMap.get(w.id)?.get() || 0));
        
        if (currentZ === maxZ) {
          // If already the top window, minimise it
          toggleMinimise(existingWin.id);
        } else {
          // Otherwise, just bring to front
          bringToFront(existingWin.id);
        }
      }
    } else {
      // Open new window if none exist for this app
      openApp(appName);
    }
  };

  return (
    <div style="width: 100vw; height: 100vh; background: var(--bg-deep); position: relative; overflow: hidden;">
      {For({
        each: () => wins.get(),
        children: [(w) => {
          const app = registry.get(w.app);
          if (!app) return document.createTextNode('');

          const zIndexSignal = zIndexMap.get(w.id);
          const minimisedSignal = minimisedMap.get(w.id);
          if (!zIndexSignal || !minimisedSignal) return document.createTextNode('');
          
          return (
            <AppWindow
              app={app}
              x={w.x}
              y={w.y}
              zIndex={() => zIndexSignal.get()}
              minimised={() => minimisedSignal.get()}
              props={w.props}
              onClose={() => {
                zIndexMap.delete(w.id);
                minimisedMap.delete(w.id);
                wins.set(wins.get().filter(x => x.id !== w.id));
              }}
              onMinimise={() => toggleMinimise(w.id)}
              onFocus={() => bringToFront(w.id)}
            />
          );
        }]
      })}

      {widgets.map((widget, idx) => widget.content({ x: window.innerWidth - 340, y: 20 + idx * 420 }))} 

      <Dock>
        {apps.filter(app => app.showInDock !== false).map(app => {
          const appWins = () => wins.get().filter(w => w.app === app.name);
          const hasWindow = () => appWins().length > 0;
          const isMinimised = () => {
            const win = appWins()[0];
            if (!win) return false;
            const sig = minimisedMap.get(win.id);
            return sig ? sig.get() : false;
          };
          
          return (
            <DockIcon 
              onClick={() => handleDockClick(app.name)} 
              title={app.name}
              style={() => `position: relative; ${hasWindow() ? 'background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.12);' : ''}`}
            >
              {app.icon ? (
                <Icon name={app.icon} size={28} />
              ) : (
                <Icon name="Package" size={28} />
              )}
              {hasWindow() && (
                <div style={() => `position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: ${isMinimised() ? '16px' : '24px'}; height: 3px; background: var(--accent); border-radius: 2px; transition: width 0.2s;`} />
              )}
            </DockIcon>
          );
        })}
      </Dock>
    </div>
  );
}