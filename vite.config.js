import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,

    allowedHosts: "all",

    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 5173,
    },

    cors: true,
  },

  preview: {
    allowedHosts: "all",
  },
});