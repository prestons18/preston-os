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
  "About": { icon: "User" },
  "Blog": { icon: "BookOpen" },
  "Browser": { icon: "Globe" },
  "Contact": { icon: "Mail" },
  "Terminal": { icon: "Terminal" }
};

export const appLoaders: Record<string, ReturnType<typeof lazyLoad>> = {};
const appContentFunctions = new Map<string, (props?: any) => any>();
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

  registry.define({
    name,
    content: (props) => {
      const cachedContent = appContentFunctions.get(name);
      return cachedContent ? cachedContent(props) : h('div', null, '');
    },
    icon: appConfig.icon || "Package",
    showInDock
  });

  if (preload) {
    ensureAppLoaded(name);
  }

  return loader;
}

export async function ensureAppLoaded(name: string): Promise<void> {
  if (appContentFunctions.has(name) || loadingApps.has(name)) {
    return;
  }

  const loader = appLoaders[name];
  if (!loader) {
    console.error(`App ${name} not registered`);
    return;
  }

  loadingApps.add(name);

  try {
    await loader.ensureLoaded();
    
    const appDef = registry.get(name);
    if (!appDef?.content || typeof appDef.content !== 'function') {
      return;
    }

    appContentFunctions.set(name, appDef.content);

    registry.define({
      ...appDef,
      content: (props) => {
        const fn = appContentFunctions.get(name);
        return fn ? fn(props) : h('div', null, '');
      }
    });
  } catch (err) {
    console.error(`Failed to load app ${name}:`, err);
  } finally {
    loadingApps.delete(name);
  }
}