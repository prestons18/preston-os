export interface AppOpener {
  open(name: string, props?: any): Promise<void>;
}

class DesktopAppOpener implements AppOpener {
  private openAppFn?: (
    name: string,
    props?: any,
    position?: { x?: number; y?: number }
  ) => Promise<boolean>;
  private importPromise?: Promise<void>;

  async open(name: string, props?: any): Promise<void> {
    if (!this.openAppFn) {
      if (!this.importPromise) {
        this.importPromise = import("../wm/desktop").then((module) => {
          this.openAppFn = module.openApp;
        });
      }
      await this.importPromise;
    }

    // Call openApp and ignore the boolean return value
    await this.openAppFn!(name, props);
  }
}

class MobileAppOpener implements AppOpener {
  constructor(private opener: (name: string, props?: any) => void) {}

  async open(name: string, props?: any): Promise<void> {
    this.opener(name, props);
  }
}

// Factory
export function createAppOpener(
  mobileOpener?: (name: string, props?: any) => void
): AppOpener {
  return mobileOpener
    ? new MobileAppOpener(mobileOpener)
    : new DesktopAppOpener();
}
