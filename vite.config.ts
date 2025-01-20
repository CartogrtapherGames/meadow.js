import { defineConfig } from "vite";

import { assetpackPlugin } from "./scripts/assetpack-vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [assetpackPlugin(), tsconfigPaths()],
  server: {
    hmr:{
      port: 8080
    },
    port: 8080,
    open: true,
    watch: {
      usePolling: true, // Optional: Ensures compatibility with certain file systems
    },
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  }
});
