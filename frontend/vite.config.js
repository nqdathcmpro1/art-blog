import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      pages: path.resolve(__dirname, "./src/pages"),
      utils: path.resolve(__dirname, "./src/utils"),
      slices: path.resolve(__dirname, "./src/slices"),
      selectors: path.resolve(__dirname, "./src/selectors"),
      api: path.resolve(__dirname, "./src/api"),
      public: path.resolve(__dirname, "./src/public"),
      styles: path.resolve(__dirname, "./src/styles"),
      store: path.resolve(__dirname, "./src/store"),
      thunks: path.resolve(__dirname, "./src/thunks"),
    },
  },
});
