import { SyntaxHighlighter } from "@packages/syntax-highlighter";
import { StyledLink } from "../../../styledComponents/StyledLink";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";

export const FunctionOverloads = () => {
  return (
    <div>
      <StyledMainTitle>Function overloads</StyledMainTitle>
      <div>
        Function overloads allow us to overload a function with different call signatures. Those
        call signatures can have different return types based on what's passed into them. Using the
        function keyword is required for this.
      </div>
      <div>Example:</div>
      <SyntaxHighlighter
        code={`function example(arg: "test"): "test";
function example(arg: 1): 1;
function example(arg: unknown) {
  return arg;
}

const first = example(1);
const second = example("test");`}
        animatedWriting
        withCursor
      />
      <div>This way typescript knows that first's type is 1, and second's type is "test".</div>
      <StyledSubTitle>Function overloads vs conditional types</StyledSubTitle>
      <div>
        Similarly to what was shown in{" "}
        <StyledLink pathname="/typescript/generics/advanced-generics">Advanced generics</StyledLink>
        , we can make typescript infer correctly return types of functions that conditionally return
        different things, with function overloads:
      </div>
      <SyntaxHighlighter
        code={`function example(arg: "test1"): "test2";
function example(arg: "test2"): "test1";
// When having overloaded functions, the implementation signature is not exposed outside of the function, so the type "test1" | "test2" becomes an internal signature.
// The overload signature is supposed to be compatiable with the implementation signature, otherwise we will get errors.
// "test1" | "test2" can also be changed into a string, it wouldn't really affect the function's behavior, as the function overloads dictate what are really the expected types.
function example(arg: "test1" | "test2"): "test1" | "test2" {
  // Function overloads aren't particularly type safe, so without stating an explicit return type, we would be able to return some irrelevant values in the return clause, and that would lead to incorrect return types.
  return arg === "test1" ? "test2" : "test1";
}

const test1 = example("test1");
const test2 = example("test2");`}
        animatedWriting
        withCursor
      />
      <StyledSubTitle>Function overloads vs union types</StyledSubTitle>
      <div>
        If a function consistently return the same values regardless of received properties,
        function overloads aren't necessary.
      </div>
      <div>
        Function overloads work the best when we have different return types based off what we pass
        into the function.
      </div>
      <StyledSubTitle>Generics in function overloads</StyledSubTitle>
      <div>We can also use generics in function overloads, for example:</div>
      <SyntaxHighlighter
        code={`function example(arg: 1): 2;
function example<T>(arg: T): T;
function example(arg: unknown): unknown {
  if (arg === 1) {
    return 2;
  }

  return arg;
}`}
        animatedWriting
        withCursor
      />
      <div>
        We can also use generics on function overload signatures to map different type argument
        setups, that means we can have one signature with no type arguments, another with one,
        another with two, and so on.
      </div>
      <div>
        According to these signatures, typescript will force you to be in that generic slot or
        function overload, based off the amount of the type arguments it received.
      </div>
      <StyledSubTitle>Declaring overload functions on interfaces</StyledSubTitle>
      <div>We can declare overload functions on interfaces, for example:</div>
      <SyntaxHighlighter
        code={`interface Example {
  callback(): 1;
  callback(arg: "test"): 2;
}`}
        animatedWriting
        withCursor
      />
      <StyledSubTitle>Overload functions to infer initial data</StyledSubTitle>
      <div>
        Assuming we have a function that returns data, and it has an argument for initial data. If
        we make the initial data an optional value, that would mean that typescript would always
        treat the function as if it will always return a value or undefined.
      </div>
      <div>
        With overload functions, we can make the types more precise. So that instead of the
        following:
      </div>
      <SyntaxHighlighter
        code={`function getData<T>(callback: () => Promise<T>, initialData?: T) {
  let data = initialData;

  callback().then((fetched) => {
    data = fetched;
  });

  return {
    receiveData: () => data,
  };
}

const data = getData(() => Promise.resolve(1), 2).receiveData(); // typescript infers that data is of type number | undefined
`}
        animatedWriting
        withCursor
      />
      <div>We can use overload functions:</div>
      <SyntaxHighlighter
        code={`function getData<T>(callback: () => Promise<T>): { receiveData: () => T | undefined };
function getData<T>(callback: () => Promise<T>, initialData: T): { receiveData: () => T};
function getData<T>(callback: () => Promise<T>, initialData?: T) {
  let data = initialData;

  callback().then((fetched) => {
    data = fetched;
  });

  return {
    receiveData: () => data,
  };
}

const data = getData(() => Promise.resolve(1), 2).receiveData(); // typescript infers that data is of type number`}
        animatedWriting
        withCursor
      />
      <StyledSubTitle>The "Instantiated with subtype" error</StyledSubTitle>
      <div>
        When we want to have an optional argument for a function with a default value, typescript
        might complain that the default value doesn't fit to the expected type, even if it does.
      </div>
      <div>
        The error is happening because the function might get called with different types out of the
        expected union typescript inferred, and limiting it to a default value makes it hard for
        typescript to infer the different types accordingly (might have to do with a conflict
        between a generic type constraint and a default value that makes the argument optional).
      </div>
      <div>For example:</div>
      <SyntaxHighlighter
        code={`const obj = {
  a: 1,
  b: 2,
  c: 3,
} as const;

type Key = keyof typeof obj;

// Typescript throws the following error:
// Type '"a"' is not assignable to type 'T'.
// '"a"' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint '"a" | "b" | "c"'
function getValue<T extends Key>(key: T = "a") {
  return obj[key];
}`}
        animatedWriting
        withCursor
      />
      <div>
        In order to fix the error and help typescript infer properly, we can use overload functions
        the following way:
      </div>
      <SyntaxHighlighter
        code={`const obj = {
  a: 1,
  b: 2,
  c: 3,
} as const;

type Key = keyof typeof obj;

function getValue(): (typeof obj)["a"]; // This one doesn't necessarily need a generic inference because its only working off the function overload.
function getValue<T extends Key>(key: T): (typeof obj)[Key]; // the generic inference is attached to one of the function overloads.
function getValue(key: Key = "a") {
  return obj[key];
}
`}
        animatedWriting
        withCursor
      />
    </div>
  );
};
