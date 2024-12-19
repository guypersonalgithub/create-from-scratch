import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";
import { StyledLink } from "../../../styledComponents/StyledLink";

export const AdvancedGenerics = () => {
  return (
    <div>
      <StyledMainTitle>Advanced generics</StyledMainTitle>
      <div>
        Typescript isn't clever enough to map a conditional type on it, so we need to use "as"
        somewhere on it.
      </div>
      <div>For example, let's take the following example:</div>
      <PseudoTerminalVisuals
        code={`const example = <T extends "test1" | "test2">(arg: T) => {
  return arg === "test1" ? "test2" : "test1";
};`}
        animatedWriting
        withCursor
      />
      <div>
        The returned value, according to typescript is either "test1" or "test2" regardless of what
        argument is passed through it.
      </div>
      <div>
        In order to have more accurate return types, based off the argument received, we can use one
        of the following options:
      </div>
      <PseudoTerminalVisuals
        code={`const example = <T extends "test1" | "test2">(arg: T): T extends "test1" ? "test2" : "test1" => {
  return (arg === "test1" ? "test2" : "test1") as any; // without the "as any" typescript would add the following warning:
  // Type '"test1" | "test2"' is not assignable to type 'T extends "test1" ? "test2" : "test1"'.
  // Type '"test1"' is not assignable to type 'T extends "test1" ? "test2" : "test1"'. ;
  // By adding the "as any" we tell typescript that we know better than typescript in this situation, as it isn't able to infer on its own.
};`}
        animatedWriting
        withCursor
      />
      <div>Or</div>
      <PseudoTerminalVisuals
        code={`const example = <T extends "test1" | "test2">(arg: T) => {
  return (arg === "test1" ? "test2" : "test1") as T extends "test1" ? "test2" : "test1";
};`}
        animatedWriting
        withCursor
      />
      <div>Personally, I prefer the second option as it avoids using any.</div>
      <div>
        In the following example, both approaches once again work, but I prefer avoiding casting as
        any.
      </div>
      <div>
        When we try to return a value from a function while explicitly stating it, typescript shows
        some of its limitations, due to not being able to trust that a key breaks down at that
        specific level (due to different keys having different values).
      </div>
      <PseudoTerminalVisuals
        code={`const example = <Property extends keyof Example>(
  prop: Property,
  value: Example[Property],
  // Once adding the as Example[Property], we can remove the return type here and Typescript would still understand that all returned values are of Example[Property]
): Example[Property] => {
  if (prop === "property2") {
    return new Date() as Example[Property]; // required, otherwise typescript fails to infer that Example's property2 key always has a value of Date.
  }

  return value;
};`}
        animatedWriting
        withCursor
      />
      <StyledSubTitle>Generic types in function currying</StyledSubTitle>
      <div>
        In the following example, typescript cannot infer the types of the second and third
        function's arguments, because the type arguments are attached to the first function:
      </div>
      <PseudoTerminalVisuals
        code={`const example =
  <One, Two, Three>(one: One) =>
  (two: Two) =>
  (three: Three) => {
    return {
      one,
      two,
      three,
    };
  };

const response = example(1)("test")(3);`}
        animatedWriting
        withCursor
      />
      <div>
        We can fix the issue by either adding all type arguments to the first function (as
        typescript is incapable of infering them on its own)
      </div>
      <PseudoTerminalVisuals
        code={`const example =
  <One, Two, Three>(one: One) =>
  (two: Two) =>
  (three: Three) => {
    return {
      one,
      two,
      three,
    };
  };

const response = example<number, string, number>(1)("test")(3);`}
        animatedWriting
        withCursor
      />
      <div>
        Or, move the other generic arguments to the functions they are supposed to be associated
        with, and in that case, typescript would be able to infer the accurate types without adding
        explicit type arguments:
      </div>
      <PseudoTerminalVisuals
        code={`const example =
  <One>(one: One) =>
  <Two>(two: Two) =>
  <Three>(three: Three) => {
    return {
      one,
      two,
      three,
    };
  };

const response = example(1)("test")(3);`}
        animatedWriting
        withCursor
      />
      <div>That way, each function can capture its own generic inference.</div>
      <div>
        Inside types, we can add additional generics that are attached to specific properties that
        are functions, without having to explicitly mention them on initialization.
      </div>
      <div>For example:</div>
      <PseudoTerminalVisuals
        code={`type Object<T> = {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  clone: <U>(transform: (elem: T) => U) => Object<U>;
};

const createObject = <T>(initialObject?: Record<string, T>): Object<T> => {
  const obj: Record<string, T> = initialObject || {};

  return {
    get: (key) => obj[key],
    set: (key, value) => {
      obj[key] = value;
    },
    clone: (transform) => {
      const newObject: Record<string, any> = {};

      for (const key in obj) {
        newObject[key] = transform(obj[key]);
      }
      return createObject(newObject);
    },
  };
};

const example = createObject({ test: 2 });
const clone = example.clone((element) => String(element));`}
        animatedWriting
        withCursor
      />
      <div>
        Clone is a "cloned" object that typescript already knows its values are of type string,
        compared to the example which typescript knows that its values are of type number.
      </div>
      <StyledSubTitle>Useless generics</StyledSubTitle>
      <div>
        Sometimes programmers use too many generic arguments when less could serve the same purpose.
        For example:
      </div>
      <PseudoTerminalVisuals
        code={`const example = <T1, T2>(arg1: T1, arg2: T2): [T1, T2] => {
  return [arg1, arg2];
};`}
        animatedWriting
        withCursor
      />
      <div>and</div>
      <PseudoTerminalVisuals
        code={`const example = <T extends { arg1: unknown; arg2: unknown }>(args: T): [T["arg1"], T["arg2"]] => {
  return [args.arg1, args.arg2];
};`}
        animatedWriting
        withCursor
      />
      <div>
        result in the same solution, but one uses an additional type argument compared to the other.
        Its mainly up to preference. Having more type arguments means that there are more things to
        take care of, so that's something we have to keep up in mind.
      </div>
      <StyledSubTitle>Missing generics</StyledSubTitle>
      <div>
        Sometimes typescript fails to infer the return value of a function because it treats a
        return as the union of all possible options the function returns.
      </div>
      <div>For example:</div>
      <PseudoTerminalVisuals
        code={`const example = <T>(obj: T, key: keyof T) => {
  return obj[key];
};

const obj = {
  a: 1,
  b: "test",
  c: true,
  d: new Date(),
}

const result = example(obj, "a");`}
        animatedWriting
        withCursor
      />
      <div>
        While auto complete works, return obj[key] as mentioned earlier, represents all possible
        returns. Because of that, typescript infers that the return type of result is string |
        number | boolean | Date instead of just number.
      </div>
      <div>
        By adding a second generic type that would represent the key (and by adding a specific
        constraint into it) we can help typescript infer better, so that we would get accurate types
        instead of a complete union of types.
      </div>
      <PseudoTerminalVisuals
        code={`const example = <T, Key extends keyof T>(obj: T, key: Key) => {
  return obj[key];
};

const obj = {
  a: 1,
  b: "test",
  c: true,
  d: new Date(),
};

const result = example(obj, "a");`}
        animatedWriting
        withCursor
      />
      <div>Now, typescript knows that result's type is number only.</div>
      <StyledSubTitle>Refactoring generics for a cleaner API</StyledSubTitle>
      <div>
        By adding a "factory" function at the top level, we can create an identity function that
        doesn't do anything and just passes in a type argument, in order to get easy inference
        around the rest of the application.
      </div>
      <div>
        By doing so, we won't have to constantly add type arguments to a repetitive function
        everytime we use it, if we want to consistently have the same shared type over and over.
      </div>
      <div>For example:</div>
      <PseudoTerminalVisuals
        code={`const getMode = <Mode = {}>(callback: (mode: Mode) => CSSProperties) => {
  // Assume we fetch some css properties regarding variants of a global light / dark mode for example.
  return {} as CSSProperties;
};

type SpecificMode = {
  color: {
    background: string;
  };
  fontSize: {
    primary: string;
  };
};

const example1 = getMode<SpecificMode>((mode) => ({
  backgroundColor: mode.color.background,
}));

const example2 = getMode<SpecificMode>((mode) => ({
  font: mode.fontSize.primary,
}));
`}
        animatedWriting
        withCursor
      />
      <div>
        requires every place that uses getMode to add the associated type argument, while the
        following example lets us initialize the getMode function with the specific type we want,
        and reuse it everywhere we desire:
      </div>
      <PseudoTerminalVisuals
        code={`const generateGetMode = <Mode = {}>() => {
  const getMode = (callback: (mode: Mode) => CSSProperties) => {
    // Assume we fetch some css properties regarding variants of a global light / dark mode for example.
    return {} as CSSProperties;
  };

  return getMode;
}

const getMode = generateGetMode<SpecificMode>();

type SpecificMode = {
  color: {
    background: string;
  };
  fontSize: {
    primary: string;
  };
};

const example1 = getMode((mode) => ({
  backgroundColor: mode.color.background,
}));

const example2 = getMode((mode) => ({
  font: mode.fontSize.primary,
}));
`}
        animatedWriting
        withCursor
      />
      <div>
        That way, we can initialize multiple getModes with different types and share them whenever a
        specific getMode with a specific type is necessary, instead of attaching type same type
        arguments everywhere throughout the application.
      </div>
      <StyledSubTitle>The partial inference problem</StyledSubTitle>
      <div>
        Sometimes typescript is incapable of doing certain things in a single function call.
      </div>
      <div>
        For example, even if we have two type arguments, and the function's arguments rely on the
        type arguments, typescript fails to infer them at the same function call.
      </div>
      <div>For example:</div>
      <PseudoTerminalVisuals
        code={`type Args = {
  first: string;
  second: string;
  third: string;
};

const example = <T, TCallbacks extends Record<string, (args: T) => unknown>>(
  callbacks: TCallbacks,
) => {
  return callbacks;
};

const callbacks = example<Args>({
  example1: (args) => args.first + args.second,
  example2: (args) => args.third + args.first,
});`}
        animatedWriting
        withCursor
      />
      <div>
        Typescript would complain that it expects two type arguments even though its supposed to
        infer properly with one, and because of that it fails to infer what are args and adds many
        warnings.
      </div>
      <div>
        The way to fix that, is by splitting the function into two different function calls, for as
        long as typescript doesn't support partial inferences.
      </div>
      <PseudoTerminalVisuals
        code={`type Args = {
  first: string;
  second: string;
  third: string;
};

const example = <T>() => <TCallbacks extends Record<string, (args: T) => unknown>>(
  callbacks: TCallbacks,
) => {
  return callbacks;
};

const callbacks = example<Args>()({
  example1: (args) => args.first + args.second,
  example2: (args) => args.third + args.first,
});`}
        animatedWriting
        withCursor
      />
      <div>That way, typescript is able of inferring the appropriate types.</div>
      <div style={{ display: "flex", gap: "5px" }}>
        <StyledLink pathname="/typescript/generics">Generics</StyledLink>
      </div>
    </div>
  );
};
