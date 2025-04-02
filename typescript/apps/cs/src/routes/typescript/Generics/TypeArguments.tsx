import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";
import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";

export const TypeArguments = () => {
  return (
    <div>
      <StyledMainTitle>Type arguments</StyledMainTitle>
      <div>
        We can pass to a function a type argument, in order to maintain a specific type, when no
        arguments are expected to be passed or are optional. For example, we often use a useState
        with a type argument as a way to limit the potential value types that specific state may
        have.
      </div>
      <div>
        On the following example, we limit the value of the following state to only expect strings
        (or undefined since the initial value is optional and we don't pass any argument).
      </div>
      <PseudoTerminalVisuals
        code={`const [value, setValue] = useState<string>();`}
        // animatedWriting
        // withCursor
        highlightCode
      />
      <StyledSubTitle>Default type arguments</StyledSubTitle>
      <div>We can set a default type for a type argument, incase a type argument is passed.</div>
      <div>
        For example, in the following function, if no type argument is passed, we expect the
        argument to be of type string.
      </div>
      <PseudoTerminalVisuals
        code={`const example = <T = string>(arg: T) => {
  return arg;
};
const test = example("test");
const test2 = example<number>(1);`}
        // animatedWriting
        // withCursor
        highlightCode
      />
      <StyledSubTitle>Infer types from type arguments</StyledSubTitle>
      <div>
        We can pass type arguments to other type arguments and typescript would be able to infer the
        correct types from them.
      </div>
      <div>
        In the following example, typescript will be able to understand the type of cloned due to
        passing the generic type the cloning function receives as an argument.
      </div>
      <PseudoTerminalVisuals
        code={`class Example<T> {
  private props: T;

  constructor(props: T) {
    this.props = props;
  }

  getProps = () => this.props;
}

const cloneExample = <T,>(component: Example<T>) => {
  return new Example(component.getProps());
};

const example = new Example({ a: 1, b: 2, c: 3 });

const cloned = cloneExample(example);`}
        // animatedWriting
        // withCursor
        highlightCode
      />
      <div>
        Common functions often have a type argument. For example, a reduce function has one for the
        expected returned value, so we can apply the following:
      </div>
      <PseudoTerminalVisuals
        code={`const example = [{ label: "1" }, { label: "2" }].reduce<Record<string, { label: string }>>(
  (acc, current) => {
    acc[current.label] = current;
    return acc;
  },
  {},
);`}
        // animatedWriting
        // withCursor
        highlightCode
      />
      <div>
        And typescript would be able to infer from that, what is the expected type of example and
        the passed empty object value that is the accumulator.
      </div>
      <StyledSubTitle>Computation within arguments</StyledSubTitle>
      <div>
        When we declare type arguments, we can do computation inside them, in order to avoid doing
        the same expensive computations multiple times.
      </div>
      <div>
        If, for example, we have a recursive type that creates some sort of a type result
        dynamically, we can just add an additional argument, assign the computation into it, and
        reuse it whenever necessary.
      </div>
    </div>
  );
};
