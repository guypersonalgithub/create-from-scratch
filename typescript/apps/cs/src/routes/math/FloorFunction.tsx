import { MathML, unicodes } from "@packages/mathml";

export const FloorFunction = () => {
  return (
    <div>
      <h3>Floor function</h3>
      <div>
        A floor function is defined as the largest integer less than or equal to the variable. For
        instance,
      </div>
      <div style={{ display: "flex" }}>
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
