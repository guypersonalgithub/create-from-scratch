import { tokenizer } from "@packages/math-parser";

const tokens = tokenizer({ input: "1 +3 - 5 *-4(15.2 * 3 ^ 2)5" });
console.dir(tokens);
