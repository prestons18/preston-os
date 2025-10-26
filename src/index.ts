import { render } from "fuse";
import { registry } from "./pmod/registry";

import "./apps/notes";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
const app = registry.list()[0].content();
render(app, root);