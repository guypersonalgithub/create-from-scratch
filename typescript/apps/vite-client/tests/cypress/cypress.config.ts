import { config } from "@packages/cypress";
import { defineConfig } from "cypress";

const { e2e = {}, ...rest } = config;

export default defineConfig({
  e2e: {
    ...e2e,
    baseUrl: "http://localhost:5173",
    supportFile: "./tests/cypress/cypress/support/e2e.ts",
    specPattern: "./tests/cypress/tests/*.cy.{ts, tsx}",
  },
  ...(rest ?? {}),
});
