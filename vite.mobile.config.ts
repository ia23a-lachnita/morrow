import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(root, "mobile"),
  base: "./",
  publicDir: path.join(root, "public"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.join(root, "src") },
  },
  build: {
    outDir: path.join(root, "dist-mobile"),
    emptyOutDir: true,
  },
});
