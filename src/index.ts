import { render } from "fuse";
import { Desktop } from "./wm/desktop";

import "./blog/loader";
import "./apps/about";
import "./apps/blog";
import "./apps/browser";
import "./apps/contact";
import "./apps/terminal";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
render(Desktop(), root);