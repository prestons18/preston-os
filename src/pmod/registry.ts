import { Children } from "fuse";
import { icons } from "lucide";

export interface PmodApp {
    name: string;
    content: () => Children;
    icon?: keyof typeof icons;
    width?: number;
    height?: number;
}

export class AppRegistry {
    private apps: Record<string, PmodApp> = {};

    define(app: PmodApp) {
        if (this.apps[app.name]) {
            console.warn(`App ${app.name} is already defined.`);
            return;
        }
        this.apps[app.name] = app;
    }

    get(name: string): PmodApp | undefined {
        return this.apps[name];
    }

    list(): PmodApp[] {
        return Object.values(this.apps);
    }
}

// Singleton
export const registry = new AppRegistry();

// Utils
export const defineApp = (app: PmodApp) => registry.define(app);
export const getApp = (name: string) => registry.get(name);
export const listApps = () => registry.list();