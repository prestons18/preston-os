import { render } from "@prestonarnold/fuse";
import { Desktop } from "./wm/desktop";
import { registerApp } from "./utils/appRegistry";
import "../src/styles/theme.css";

import "./blog/loader";

// Preload common apps
registerApp("About", () => import("./apps/about/app"), true);
registerApp("Blog", () => import("./apps/blog/app"), true);
registerApp("Contact", () => import("./apps/contact/app"), true);

// Register other apps with lazy loading
registerApp("Browser", () => import("./apps/browser/app"), false, false);
registerApp("Terminal", () => import("./apps/terminal/app"));

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
render(Desktop(), root);
