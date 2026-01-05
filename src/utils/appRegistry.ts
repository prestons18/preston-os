import { h } from "@prestonarnold/fuse";
import { lazyLoad } from "./lazyLoad";
import { registry } from "../pmod/registry";
import { IconName } from "../utils/icons";

declare global {
  interface Window {
    mobileOpenApp?: (name: string, props?: any) => void;
  }
}

type AppConfig = { icon: IconName };

const defaultAppConfigs: Record<string, AppConfig> = {
  About: { icon: "User" },
  Blog: { icon: "BookOpen" },
  Browser: { icon: "Globe" },
  Contact: { icon: "Mail" },
  Terminal: { icon: "Terminal" },
};

export const appLoaders: Record<string, ReturnType<typeof lazyLoad>> = {};
const loadedApps = new Set<string>();
const loadingApps = new Set<string>();

export function registerApp(
  name: string,
  importFn: () => Promise<any>,
  preload = false,
  showInDock = true
) {
  if (appLoaders[name]) {
    return appLoaders[name];
  }

  const loader = lazyLoad(importFn);
  appLoaders[name] = loader;

  const appConfig = defaultAppConfigs[name] || {};

  // Register with a placeholder initially
  registry.define({
    name,
    content: (props) => {
      // This will be replaced once the app loads
      return h("div", null, "");
    },
    icon: appConfig.icon || "Package",
    showInDock,
  });

  if (preload) {
    ensureAppLoaded(name).catch((err) =>
      console.error(`Failed to preload ${name}:`, err)
    );
  }

  return loader;
}

export async function ensureAppLoaded(name: string): Promise<boolean> {
  // Already loaded successfully
  if (loadedApps.has(name)) {
    const app = registry.get(name);
    if (app && typeof app.content === "function") {
      return true;
    }
  }

  // Currently loading, wait for it
  if (loadingApps.has(name)) {
    // Wait a bit and check again
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadedApps.has(name);
  }

  const loader = appLoaders[name];
  if (!loader) {
    console.error(`App ${name} not registered`);
    return false;
  }

  loadingApps.add(name);

  try {
    // Load the module
    await loader.ensureLoaded();

    // Give the module time to register itself
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the app was registered properly
    const app = registry.get(name);
    if (!app || typeof app.content !== "function") {
      console.error(`App ${name} loaded but not registered properly`);
      return false;
    }

    // Test that the content function actually works
    try {
      const testContent = app.content({});
      // Content should return a valid DOM node or element
      if (!testContent) {
        console.error(`App ${name} content function returns nothing`);
        return false;
      }
    } catch (err) {
      console.error(`App ${name} content function throws error:`, err);
      return false;
    }

    loadedApps.add(name);
    return true;
  } catch (err) {
    console.error(`Failed to load app ${name}:`, err);
    return false;
  } finally {
    loadingApps.delete(name);
  }
}

// Helper to check if an app is ready
export function isAppReady(name: string): boolean {
  if (!loadedApps.has(name)) {
    return false;
  }

  const app = registry.get(name);
  return !!(app && app.content && typeof app.content === "function");
}
