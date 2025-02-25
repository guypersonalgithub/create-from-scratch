import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";

export const Test = () => {
  const code = `import test, { whatever as test , nice } from "hello";
const test: string = "hello" as any as any as "hi"; //test
const testing = { test: "what" as string as string, testing: { test: { whatever }}};
const test = <Test extends string>(test: string) => { 
  const testing = 2.5;
  const isTrue = true;
  const isFalse = false;
  const another = isTrue !== isFalse;
  const testing2 = () => {
    return "This is a test"; /*
        Another comment
    */
  }
        function test<T>() {
          return <Test test={why} test="hi" />;
        }

        const testing3 = () => {
          return <Test extends />;
        }
};
const testing4 = undefined;
const testing5 = null;
function testing2() {};
const testing6 = test("hello");
const testing7 = ["test" as string,,,,,,,,,,, , , true, false, hi, "hello", 'hey'];
const initial = new Test();
import.meta;`;

  return (
    <PseudoTerminalVisuals
      code={code}
      // code={`(1 + 2) < 3 + 4;`}
      highlightCode
    />
  );
};
