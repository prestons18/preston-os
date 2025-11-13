import { Children } from "fuse";
import { IconName } from "../utils/icons";

export interface PmodApp {
    name: string;
    content: (props?: any) => Children;
    icon?: IconName;
    width?: number;
    height?: number;
    showInDock?: boolean;
}

export interface PmodWidget {
    name: string;
    content: (props: { x: number; y: number }) => Children;
    icon?: IconName;
    defaultWidth?: number;
    defaultHeight?: number;
    refreshInterval?: number;
}

export class AppRegistry {
    private apps: Record<string, PmodApp> = {};

    define(app: PmodApp) {
        if (this.apps[app.name]) {
            Object.assign(this.apps[app.name], app);
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

export class WidgetRegistry {
    private widgets: Record<string, PmodWidget> = {};

    define(widget: PmodWidget) {
        if (this.widgets[widget.name]) {
            Object.assign(this.widgets[widget.name], widget);
            return;
        }
        this.widgets[widget.name] = widget;
    }

    get(name: string): PmodWidget | undefined {
        return this.widgets[name];
    }

    list(): PmodWidget[] {
        return Object.values(this.widgets);
    }
}

// Singletons
export const registry = new AppRegistry();
export const widgetRegistry = new WidgetRegistry();

// Utils
export const defineApp = (app: PmodApp) => registry.define(app);
export const getApp = (name: string) => registry.get(name);
export const listApps = () => registry.list();

export const defineWidget = (widget: PmodWidget) => widgetRegistry.define(widget);
export const getWidget = (name: string) => widgetRegistry.get(name);
export const listWidgets = () => widgetRegistry.list();