import { defineConfig } from "vite";
import { resolve } from "path";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  publicDir: "static",
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "null",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  define: {
    __DEV__: true,
  },
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
});
