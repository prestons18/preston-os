import { render } from "fuse";
import { Desktop } from "./wm/desktop";

import "./apps/notes";
import "./apps/about";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
render(Desktop(), root);