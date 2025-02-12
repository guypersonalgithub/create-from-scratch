import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";

export const Test = () => {
  return (
    <PseudoTerminalVisuals
      code={`import test, { whatever as test , nice! } from "hello";
const test: string = "hello" as any as any as "hi"; //test
const testing = { test: "what" as string as string, testing: { test: { whatever }}};
const test = <Test extends string>(test: string) => {};`}
      // code={`(1 + 2) < 3 + 4;`}
      highlightCode
    />
  );
};

// TODO: Debug "{" as a standalone, there seem to be an infinite loop somewhere.
// "<" tag may only appear after a = operator, after an arrow or after a return.
// "<" comparison only appears between two values (variables, numbers, etc).
// "<" type appears only after a type defintion/type name/type generic right next to a parenthesis that ends with an arrow/type generic right after a function's name.
// Also, extends/commas, etc are also types.

// TODO: Add support for type extends ? a : b with recursion.
