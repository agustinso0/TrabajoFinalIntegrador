import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    // permite resolver imports sin extensión en desarrollo
    extensions: [".ts", ".js", ".json"],
  },
  build: {
    ssr: "src/index.ts",
    outDir: "dist",
    target: "node20",
    rollupOptions: {
      // externalizar dependencias de node_modules para no bundlear todo
      external: ["express", "mongoose", "jsonwebtoken", "cors", "helmet"],
      output: {
        format: "es",
      },
    },
  },
});
