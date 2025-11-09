import { MathML, unicodes } from "@packages/mathml";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";
import { dynatic } from "../../dynatic-css.config";

export const FloorFunction = () => {
  return (
    <div>
      <StyledMainTitle>Floor function</StyledMainTitle>
      <div>
        A floor function is defined as the largest integer less than or equal to the variable. For
        instance,
      </div>
      <div
        className={dynatic`
          display: flex;
        `}
      >
        <div>{unicodes.javascript.leftFloor}</div>
        <div>x</div>
        <div>{unicodes.javascript.rightFloor}</div>
      </div>
      <div>If we assign 2.5 to x, then the result would be 2.</div>
      <MathML input="f(x) = floor(x)" isAnExpression />
      <MathML input="f(2.5) = floor(2.5) = 2" isAnExpression />
    </div>
  );
};
