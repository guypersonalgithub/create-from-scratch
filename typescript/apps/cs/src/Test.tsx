import { SyntaxHighlighter } from "@packages/syntax-highlighter";

export const Test = () => {
  const templateLiteral = "`${123} testing`";

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
import.meta;
test.test.test.test<T extends "" ? "" : "">().test.testing.test();
class Example<T> {
  private props: T;
  static props2: T;
  public props3: T;
  a;
  a2: number
  2
  3 = "a" as any;

  constructor(props: T) {
    this.props = props;
  }

  test(test: string) {
    return test;
  }

  testing = () => {
    console.log("test");
  }
}

abstract class Example2 {}

const example = new Example<T extends "" ? "" extends "??" ? "test" : "" : "" extends "" ? string : null>("test");
const testing = 1 === 2 ? 4 : 5;
if (test) {
  return "test";
}
${templateLiteral};
type Test = | {
  test: string;
  testing: keyof any;
  testing2?: {
    test: number;
    testing2: {
      testing3: {
        testing4: {
          testing5: [string[][], any,];
          testing6: (test: string, test?: test) => any;
        }
      }
    }
  }
} | testing | string[] | [string];
type Test = (string?: string, { string}?: number, [test, {any}, any]?: string) => void;
const testing3 = ((() => {}));`;

  const yamlCode = `name: Syntax-Highlighter tests
on:
  pull_request:
    branches:
      - main
    types:
      - opened
      - synchronize
      - reopened
    paths:
      - typescript/packages/syntax-highlighter/**
      - typescript/packages/utils/**
jobs:
  Syntax-Highlighter-tests:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./typescript
    steps:
      - uses: actions/checkout@v4
      - name: Remove postinstall
        run: node ./ci-scripts/removePostInstall.js cs
      - name: Install dependencies
        run: npm i
      - name: Run tests
        run: cd packages/syntax-highlighter && npm run test`;

  return (
    <>
      <SyntaxHighlighter
        code={code}
        // code={`(1 + 2) < 3 + 4;`}
        highlightCode
      />
      <SyntaxHighlighter code={yamlCode} highlightCode language="yaml" />
    </>
  );
};
