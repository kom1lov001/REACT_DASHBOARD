import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    open: true, // Auto-open browser on dev start
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Output directory for production build
    sourcemap: mode === "development", // Enable sourcemaps in dev mode
  },
  envDir: "env", // Directory for environment variables (e.g., HRMS-specific configs)
  define: {
    "process.env.APP_NAME": JSON.stringify("HRMS"),
    "process.env.APP_VERSION": JSON.stringify("v2.0"),
    "process.env.CURRENT_DATE": JSON.stringify("18-Iyun, 2025"),
    "process.env.CURRENT_TIME": JSON.stringify("20:33"),
  },
}));