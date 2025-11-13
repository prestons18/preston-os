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
  
  const defaultConfig = defaultAppConfigs[name] || {};
  
  registry.define({
    name,
    content: (props) => {
      loader.ensureLoaded();
      return null;
    },
    icon: defaultConfig?.icon || "Package",
    showInDock: true
  });
  
  if (preload && !loadingApps.has(name)) {
    loadingApps.add(name);
    loader.ensureLoaded().catch(err => {
      console.error(`Failed to preload app ${name}:`, err);
    }).finally(() => {
      loadingApps.delete(name);
    });
  }
  
  return loader;
}
