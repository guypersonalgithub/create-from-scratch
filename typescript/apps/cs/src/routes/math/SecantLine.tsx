import { MathML, unicodes } from "@packages/mathml";
import { Link } from "@packages/router";

export const SecantLine = () => {
  return (
    <div>
      <h3>Secant line</h3>
      <div>The secant line is a straight line created by two points of a curve.</div>
      <div>As both are brought together, the secant line tends to a tangent line.</div>
      <div>
        {unicodes.javascript.capitalDelta}y is the difference between the y values of both of the
        points (change in y).
      </div>
      <div>
        {unicodes.javascript.capitalDelta}x is similarly the difference between the x values of both
        of the points (change in x).
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        The slope of the secant line is
        <MathML
          input={`(${unicodes.javascript.capitalDelta}y)/(${unicodes.javascript.capitalDelta}x)`}
          isAnExpression
        />
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <Link pathname="/math/tangent-line" style={{ color: "#5662F6" }}>
          Tangent line
        </Link>
      </div>
    </div>
  );
};
