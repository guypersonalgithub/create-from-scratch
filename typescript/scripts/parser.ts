import { tokenizer } from "@packages/math-parser";

const { tokens } = tokenizer({ input: "1 +3 - 5 *-4(15.2a * 3 ^ 2)5 + sin(15) * ln4lnc" });
console.dir(tokens);
