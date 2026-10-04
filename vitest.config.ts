import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // En tests no hay runtime de Next: `server-only` se sustituye por un módulo vacío.
      "server-only": path.resolve(__dirname, "tests/mocks/server-only.ts"),
    },
  },
});
