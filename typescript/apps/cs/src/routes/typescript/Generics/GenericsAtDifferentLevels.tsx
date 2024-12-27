import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";

export const GenericsAtDifferentLevels = () => {
  return (
    <div>
      <StyledMainTitle>Generics at different levels</StyledMainTitle>
      <div>
        Generics can represent types at all levels. We should aim to have generics represent a
        deeper level part of the type, as it becomes more readable on hover, is less messy, and
        requires less repetitive type drilling if the type is expected to be used multiple times
        throughout the function/type/class/etc.
      </div>
      <div>For example, this, is a cleaner approach:</div>
      <PseudoTerminalVisuals
        code={`const example = <T,>(
  obj: { level1: { level2: { level3: T } } },
  callback: (nestedValue: T) => T,
) => {
  return callback(obj.level1.level2.level3);
};`}
        animatedWriting
        withCursor
      />
      <div>than this approach:</div>
      <PseudoTerminalVisuals
        code={`const example = <T extends { level1: { level2: { level3: unknown } } }>(
  obj: T,
  callback: (nestedValue: T["level1"]["level2"]["level3"]) => T["level1"]["level2"]["level3"],
) => {
  return callback(obj.level1.level2.level3);
};`}
        animatedWriting
        withCursor
      />
      <div>
        The further a type is from what you are trying to infer, the worse the inference is going to
        be.
      </div>
      <div>
        So in general, its better to use generics at specific values, instead of them representing
        complete objects, if precise types are required.
      </div>
      <div>
        Casting "as const" on small objects can help Typescript with its inference, similarly to
        adding type constraints.
      </div>
      <StyledSubTitle>Inferring array member types</StyledSubTitle>
      <div>
        As mentioned in the previous example, we can receive the same desirable type through
        different methods. For the sake of simplification, we should be aiming for a deeper level
        part of the type, in order to let typescript infer the generic value easier.
      </div>
      <div>That's why, the following example:</div>
      <PseudoTerminalVisuals
        code={`const example = <T extends string>(statuses: T[]) => {
  return statuses;
};

const result = example(["1", "2", "3", "4"]); // result's type is result: ("1" | "2" | "3" | "4")[], as opposed to string[]. This way, Typescript can infer types of array members.`}
        animatedWriting
        withCursor
      />
      <div>is cleaner than this example, even though both end up with the same result:</div>
      <PseudoTerminalVisuals
        code={`const example = <T extends string[]>(statuses: T) => {
  return statuses as T[number][];
};

const result = example(["1", "2", "3", "4"] as const); // result's type is result: ("1" | "2" | "3" | "4")[], as opposed to string[]. This way, Typescript can infer types of array members.`}
        animatedWriting
        withCursor
      />
    </div>
  );
};
