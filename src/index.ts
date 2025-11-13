import { render } from "fuse";
import { Desktop } from "./wm/desktop";
import { registerApp } from "./utils/appRegistry";

import "./blog/loader";

registerApp("About", () => import("./apps/about"), true);
registerApp("Blog", () => import("./apps/blog"));
registerApp("Browser", () => import("./apps/browser"));
registerApp("Contact", () => import("./apps/contact"));
registerApp("Terminal", () => import("./apps/terminal"));

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
render(Desktop(), root);