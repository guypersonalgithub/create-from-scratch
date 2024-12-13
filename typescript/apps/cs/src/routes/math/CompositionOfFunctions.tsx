import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

export const CompositionOfFunctions = () => {
  return (
    <div>
      <StyledMainTitle>Composition Of Functions</StyledMainTitle>
      <div>
        A composition of functions is an operation where two or more functions generate a new
        function.
      </div>
      <div>
        For example, let's assume there are two functions: f(x) and g(x), and we would like to
        create a new function h(x) from them:
      </div>
      <div>
        h(x) = f(g(x)) is an example of that. f receives the value of g on any point that x equals
        to.
      </div>
    </div>
  );
};
