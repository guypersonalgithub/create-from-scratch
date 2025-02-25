import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Use global `describe`, `test`, etc.
    environment: "node", // Set to 'jsdom' if testing UI
    coverage: {
      reporter: ["text", "lcov"], // Optional: add code coverage
    },
  },
});
