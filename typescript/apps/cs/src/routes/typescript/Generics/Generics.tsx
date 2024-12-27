import { StyledLink } from "../../../styledComponents/StyledLink";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";
import { PseudoTerminalVisuals } from "@packages/pseudo-terminal-visuals";
import { useStickSubRouterLinksToTop } from "../../../useStickSubRouterLinksToTop";
import { StyledLinksContainer } from "../../../styledComponents/StyledLinksContainer";
import { SubRouter } from "@packages/router";
import { TypeArguments } from "./TypeArguments";
import { GenericsAtDifferentLevels } from "./GenericsAtDifferentLevels";
import { AdvancedGenerics } from "./AdvancedGenerics";
import { FunctionOverloads } from "./FunctionOverloads";

export const Generics = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[
          { path: "/typescript/generics/type-arguments", children: "Type arguments" },
          {
            path: "/typescript/generics/generics-at-different-levels",
            children: "Generics at different levels",
          },
          { path: "/typescript/generics/advanced-generics", children: "Advanced generics" },
          { path: "/typescript/generics/function-overloads", children: "Function overloads" },
        ]}
      />
      <SubRouter
        paths={{
          "/": () => {
            return (
              <div>
                <StyledMainTitle>Generics</StyledMainTitle>
                <div>
                  Generics are dynamic types that can be altered based off other properties passed
                  to a functions, classes, types, etc. Typescript automatically infers the assigned
                  types based off these generics.
                </div>
                <div>
                  Generics can also be applied as{" "}
                  <StyledLink pathname="/typescript/generics/type-arguments">
                    type arguments
                  </StyledLink>
                  .
                </div>
                <div>
                  In the following example, res' type is equal to the return type, so res' type is
                  "test".
                </div>
                <PseudoTerminalVisuals
                  code={`const example = <T>(arg: T) => {
  return arg;
};
const res = example("test");`}
                  animatedWriting
                  withCursor
                />
                <StyledSubTitle>Restricting generics</StyledSubTitle>
                <div>
                  Sometimes we might want to limit the specific generic types a function/type may
                  receive and yet still use a generic type. By having adding a constraint, we can
                  limit what types of values the generic potentially supports.
                </div>
                <PseudoTerminalVisuals
                  code={`const example = <T extends string>(arg: T) => {
  return arg;
};
const res = example("test"); // works without potential warnings
const res2 = example(1); // has a typescript warning, as 1 isn't a string`}
                  animatedWriting
                  withCursor
                />
                <StyledSubTitle>Multiple generics</StyledSubTitle>
                <div>
                  Similarly to the previous examples, we can use multiple different generics incase
                  we want our function/type to support multiple different types.
                </div>
                <div>
                  When passing multiple generics or values that aren't of primitive types,
                  typescript starts to get more cautious with the way it infers stuff, so it res
                  will be of type {"{ arg: string, arg2: number }"} instead of specifics. If we want
                  to infer deeply, it would require adding constraints similarly to the previous
                  example.
                </div>
                <PseudoTerminalVisuals
                  code={`const example = <T, S>(arg: T, arg2: S) => {
  return { arg, arg2 };
};
const res = example("test", 1);`}
                  animatedWriting
                  withCursor
                />
                <StyledSubTitle>Generics with classes</StyledSubTitle>
                <div>
                  As mentioned earlier, it also applies with classes. In classes, without
                  constraints, similarly to what was mentioned in multiple generics, typescript will
                  be more cautious and thus will infer more generic types.
                </div>
                <div>
                  For example, in the following example, typescript would infer the example as
                  "string" instead of as as "test".
                </div>
                <PseudoTerminalVisuals
                  code={`class Example<T> {
  private props: T;

  constructor(props: T) {
    this.props = props;
  }
}

const example = new Example("test");`}
                  animatedWriting
                  withCursor
                />
                <div>Constraints can also work with unions.</div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <StyledLink pathname="/typescript/generics/type-arguments">
                    Type arguments
                  </StyledLink>
                  <StyledLink pathname="/typescript/generics/advanced-generics">
                    Advanced generics
                  </StyledLink>
                  <StyledLink pathname="/typescript/generics/function-overloads">
                    Function overloads
                  </StyledLink>
                </div>
              </div>
            );
          },
          "/type-arguments": <TypeArguments />,
          "/generics-at-different-levels": <GenericsAtDifferentLevels />,
          "/advanced-generics": <AdvancedGenerics />,
          "/function-overloads": <FunctionOverloads />,
        }}
      />
    </div>
  );
};
