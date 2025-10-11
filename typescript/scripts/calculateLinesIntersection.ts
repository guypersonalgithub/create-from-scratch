import { tokenizer } from "@packages/math-parser";

const { tokens: line1Tokens } = tokenizer({ input: "3x + 2y = 7" });
const { tokens: line2Tokens } = tokenizer({ input: "x - 3y = 6" });

console.log({ line1Tokens, line2Tokens });
