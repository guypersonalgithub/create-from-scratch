import { parseExports } from "@packages/export-parser";

const { exports } = parseExports({
  input:
    'export * from "./convertNumberToBinary";\n' +
    'export * from "./simulateConvertNumberToBinaryBySteps";\n' +
    'export * as test from "./testing";\n',
});

console.dir(exports, { depth: null });
