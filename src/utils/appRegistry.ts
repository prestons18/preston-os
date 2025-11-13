import { h } from "fuse";
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
  preload = false
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
      if (appContentFunctions.has(name)) {
        return appContentFunctions.get(name)!(props);
      }

      if (loader.hasLoaded()) {
        const appDef = registry.get(name);
        if (appDef && typeof appDef.content === 'function' && appDef.content !== registry.get(name)?.content) {
          appContentFunctions.set(name, appDef.content);
          return appDef.content(props);
        }
      }

      return h('div', null, '');
    },
    icon: appConfig.icon || "Package",
    showInDock: true
  });

  if (preload) {
    ensureAppLoaded(name);
  }

  return loader;
}

export async function ensureAppLoaded(name: string): Promise<void> {
  if (appContentFunctions.has(name)) {
    return;
  }

  if (loadingApps.has(name)) {
    return;
  }

  const loader = appLoaders[name];
  if (!loader) {
    console.error(`App ${name} not registered`);
    return;
  }

  try {
    loadingApps.add(name);

    await loader.ensureLoaded();

    const appDef = registry.get(name);
    if (appDef && typeof appDef.content === 'function') {
      appContentFunctions.set(name, appDef.content);

      registry.define({
        ...appDef,
        content: (props) => appContentFunctions.get(name)!(props)
      });
    }
  } catch (err) {
    console.error(`Failed to load app ${name}:`, err);
  } finally {
    loadingApps.delete(name);
  }
}