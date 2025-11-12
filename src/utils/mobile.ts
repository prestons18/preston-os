// this is temporary

export type MobileOpenAppFunction = (name: string, props?: any) => void;

export function isMobileMode(): boolean {
  return typeof window !== 'undefined' && 'mobileOpenApp' in window;
}

export function openAppCrossPlatform(name: string, props?: any): void {
  if (isMobileMode() && window.mobileOpenApp) {
    window.mobileOpenApp(name, props);
  } else {
    import('../wm/desktop').then(({ openApp }) => {
      openApp(name, props);
    }).catch(err => {
      console.error('Failed to open app:', err);
    });
  }
}

declare global {
  interface Window {
    mobileOpenApp?: MobileOpenAppFunction;
  }
}
