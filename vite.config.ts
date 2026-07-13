import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The project folder name contains a ":" which confuses Vite's default
  // filesystem allow-list, so relax strict fs serving in dev.
  server: {
    fs: { strict: false },
  },
});
