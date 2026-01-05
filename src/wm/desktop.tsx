import { h, signal, For, effect } from "@prestonarnold/fuse";
import { styled } from "../pmod/styled";
import { registry, widgetRegistry } from "../pmod/registry";
import { Icon } from "../pmod";
import { AppWindow } from "./window";
import { MobileOS } from "./mobile";
import "../widgets/prsston";
import { isMobile } from "../utils/device";
import { FuseBadge } from "../components/FuseBadge";
import { router } from "../router/client";

const Dock = styled("div", {
  position: "fixed",
  bottom: "var(--space-md)",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "var(--space-sm)",
  padding: "var(--space-sm)",
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(12px)",
  borderRadius: "var(--radius-soft)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
});

const DockIcon = styled("button", {
  width: "56px",
  height: "56px",
  background: "var(--bg-soft)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "var(--radius-base)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const wins = signal<WindowState[]>([]);
const hasOpenedInitialApp = signal(false);
let highestZIndex = 100;
const zIndexMap = new Map<string, ReturnType<typeof signal<number>>>();
const minimisedMap = new Map<string, ReturnType<typeof signal<boolean>>>();

export async function openApp(
  name: string,
  props?: any,
  position?: { x?: number; y?: number }
): Promise<boolean> {
  try {
    // BLOCK until app is fully loaded and registered
    const { ensureAppLoaded } = await import("../utils/appRegistry");
    const loaded = await ensureAppLoaded(name);

    if (!loaded) {
      console.error(`Failed to load app ${name}`);
      return false;
    }

    // Triple-check the app is in the registry with content
    const app = registry.get(name);
    if (!app || !app.content) {
      console.error(`App ${name} not properly registered`);
      return false;
    }

    const n = wins.get().length;
    const id = `${name}-${Date.now()}`;
    highestZIndex++;

    zIndexMap.set(id, signal(highestZIndex));
    minimisedMap.set(id, signal(false));

    wins.set([
      ...wins.get(),
      {
        key: id,
        id,
        app: name,
        x: position?.x ?? 100 + n * 30,
        y: position?.y ?? 80 + n * 30,
        zIndex: highestZIndex,
        minimised: false,
        props,
      },
    ]);

    return true;
  } catch (err) {
    console.error(`Failed to open app ${name}:`, err);
    return false;
  }
}

function bringToFront(id: string) {
  const zIndexSignal = zIndexMap.get(id);
  const minimisedSignal = minimisedMap.get(id);
  if (!zIndexSignal || !minimisedSignal) return;

  minimisedSignal.set(false);
  highestZIndex++;
  zIndexSignal.set(highestZIndex);
}

function toggleMinimise(id: string) {
  const minimisedSignal = minimisedMap.get(id);
  if (!minimisedSignal) return;

  if (minimisedSignal.get()) {
    bringToFront(id);
  } else {
    minimisedSignal.set(true);
  }
}

export function Desktop() {
  const apps = registry.list();
  const widgets = widgetRegistry.list();
  const isMobileView = signal(isMobile.get());

  effect(() => {
    if (!isMobileView.get() && !hasOpenedInitialApp.get()) {
      setTimeout(async () => {
        await openApp("About");
        hasOpenedInitialApp.set(true);

        const path = router.currentPath.get();
        const slug = router.currentParams.value?.slug;

        const aboutWin = wins.get().find((w) => w.app === "About");
        const basePos = aboutWin
          ? { x: aboutWin.x + 80, y: aboutWin.y + 60 }
          : { x: 700, y: 80 };

        // Blog index only: /blog
        if (path === "/blog" && !slug) {
          await openApp("Blog", undefined, basePos);
        }

        // Blog detail: /blog/:slug
        if (slug) {
          await openApp("Browser", { url: `/blog/${slug}` }, { x: 700, y: 80 });
        }
      }, 100);
    }
  });

  const handleDockClick = async (appName: string) => {
    const allWindows = wins.get();
    const existingWindows = allWindows.filter((w) => w.app === appName);

    if (existingWindows.length > 0) {
      const existingWin = existingWindows.reduce((prev, current) => {
        const prevZ = zIndexMap.get(prev.id)?.get() || 0;
        const currentZ = zIndexMap.get(current.id)?.get() || 0;
        return prevZ > currentZ ? prev : current;
      });

      const minimisedSignal = minimisedMap.get(existingWin.id);
      if (!minimisedSignal) return;

      if (minimisedSignal.get()) {
        bringToFront(existingWin.id);
      } else {
        const currentZ = zIndexMap.get(existingWin.id)?.get() || 0;
        const maxZ = Math.max(
          ...allWindows.map((w) => zIndexMap.get(w.id)?.get() || 0)
        );

        if (currentZ === maxZ) {
          toggleMinimise(existingWin.id);
        } else {
          bringToFront(existingWin.id);
        }
      }
    } else {
      try {
        await openApp(appName);
      } catch (err) {
        console.error(`Failed to open app ${appName}:`, err);
      }
    }
  };

  return () => {
    if (isMobileView.get()) {
      return <MobileOS />;
    }

    return (
      <div style="width: 100vw; height: 100vh; background: var(--bg-deep); position: relative; overflow: hidden;">
        {For({
          each: () => wins.get(),
          children: [
            (w) => {
              const app = registry.get(w.app);

              // If app isn't ready, remove this window
              if (!app || !app.content) {
                console.warn(`Removing window for unloaded app: ${w.app}`);
                setTimeout(() => {
                  wins.set(wins.get().filter((x) => x.id !== w.id));
                }, 0);
                return document.createTextNode("");
              }

              const zIndexSignal = zIndexMap.get(w.id);
              const minimisedSignal = minimisedMap.get(w.id);

              if (!zIndexSignal || !minimisedSignal) {
                return document.createTextNode("");
              }

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
                    wins.set(wins.get().filter((x) => x.id !== w.id));
                  }}
                  onMinimise={() => toggleMinimise(w.id)}
                  onFocus={() => bringToFront(w.id)}
                />
              );
            },
          ],
        })}

        {widgets.map((widget, idx) =>
          widget.content({ x: window.innerWidth - 340, y: 20 + idx * 420 })
        )}

        <FuseBadge />

        <Dock>
          {apps
            .filter((app) => app.showInDock !== false)
            .map((app) => {
              const appWins = () =>
                wins.get().filter((w) => w.app === app.name);
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
                  aria-label={`${app.name} application${
                    hasWindow() ? ", currently open" : ""
                  }`}
                  style={() =>
                    `position: relative; ${
                      hasWindow()
                        ? "background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.12);"
                        : ""
                    }`
                  }
                >
                  {app.icon ? (
                    <Icon name={app.icon} size={28} />
                  ) : (
                    <Icon name="Package" size={28} />
                  )}
                  {hasWindow() && (
                    <div
                      style={() =>
                        `position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: ${
                          isMinimised() ? "16px" : "24px"
                        }; height: 3px; background: var(--accent); border-radius: 2px; transition: width 0.2s;`
                      }
                    />
                  )}
                </DockIcon>
              );
            })}
        </Dock>
      </div>
    );
  };
}
