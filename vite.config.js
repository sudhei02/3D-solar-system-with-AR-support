import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0", // Allow external connections
    port: 5173,
    // Disable HTTPS for now - we'll use cloudflared for secure tunneling
    open: false, // Don't auto-open browser (since we're using mobile)
    allowedHosts: [
      "localhost",
      ".trycloudflare.com", // Allow all cloudflare tunnel domains
    ],
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
