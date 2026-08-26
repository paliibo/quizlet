import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    coverage: {
      exclude: ["src/**/index.ts", "src/**/*.d.ts", "src/**/*.test.ts", "src/lib/seed.ts", "src/lib/routes.ts", "src/lib/accents.ts", "src/lib/download.ts", "src/lib/cn.ts"],
      include: ["src/lib/**/*.ts", "src/store/**/*.ts"],
      provider: "v8",
      reporter: ["text", "lcov"],
    },
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
});
