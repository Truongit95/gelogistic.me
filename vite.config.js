import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import liveReload from "vite-plugin-live-reload";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
    __VUE_PROD_DEVTOOLS__: true // no effect
  },
  env: {
    VITE_FEDEX_BASE_URL: process.env.VITE_FEDEX_BASE_URL
  },
  plugins: [vue(), liveReload(`${__dirname}/../**/*\.php`)],

  build: {
    rollupOptions: {
      output: {
        dir: path.join(__dirname, "../build"),
        entryFileNames: "app.js",
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".")[1];
          if (extType === "css") {
            return `app.css`;
          } else {
            return `assets/[name]-[hash][extname]`;
          }
        },
        chunkFileNames: "app.js"
        // manualChunks: undefined,
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
