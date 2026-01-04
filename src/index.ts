import { render } from "@prestonarnold/fuse";
import { Desktop } from "./wm/desktop";
import { registerApp } from "./utils/appRegistry";
import "../src/styles/theme.css";

import "./blog/loader";

// Preload common apps
registerApp("About", () => import("./apps/about"), true);
registerApp("Blog", () => import("./apps/blog"), true);
registerApp("Contact", () => import("./apps/contact"), true);

// Register other apps with lazy loading
registerApp("Browser", () => import("./apps/browser"), false, false);
registerApp("Terminal", () => import("./apps/terminal"));

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
render(Desktop(), root);
