import { render } from "fuse";
import { Desktop } from "./wm/desktop";
import { registerApp, ensureAppLoaded } from "./utils/appRegistry";

import "./blog/loader";

// Register all apps
registerApp("About", () => import("./apps/about"), true);
registerApp("Blog", () => import("./apps/blog"));
registerApp("Browser", () => import("./apps/browser"));
registerApp("Contact", () => import("./apps/contact"));
registerApp("Terminal", () => import("./apps/terminal"));

// Explicitly ensure About app is loaded before rendering
ensureAppLoaded("About").then(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");
  render(Desktop(), root);
}).catch(err => {
  console.error("Failed to load About app:", err);
  // Render anyway as a fallback
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");
  render(Desktop(), root);
});