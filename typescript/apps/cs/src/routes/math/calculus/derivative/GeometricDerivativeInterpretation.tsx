import { MathML, unicodes } from "@packages/mathml";
import { Link } from "@packages/router";

export const GeometricDerivativeInterpretation = () => {
  return (
    <div>
      <h3>Geometric derivative interpretation</h3>
      <div>
        Following the description in{" "}
        <Link pathname="/math/tangent-line" style={{ color: "#5662F6" }}>
          Tangent line
        </Link>
        <div style={{ display: "flex", gap: "3px" }}>
          we can find the slope of a tangent(m) line with calculus as{" "}
          <MathML input="m = f'(a)" isAnExpression />.
        </div>
      </div>
      <div>
        We can check the{" "}
        <Link pathname="/math/secant-line" style={{ color: "#5662F6" }}>
          Secant line
        </Link>
        page to see how we can find a secant line of a curved function between two points.
      </div>
      <div>
        The given expression seems a bit familiar, doesn't it? You might have already encountered
        this interpretation in the average rate of change section in the{" "}
        <Link pathname="/math/calculus/derivative">Derivative</Link>
        section, as we are trying to find the changes in y and x between these points, and if point
        1's x is a, its y would be f(a), and also if the point 2's x is b, its y would be f(b).
      </div>
      <MathML
        input={`${unicodes.javascript.capitalDelta}y = ${unicodes.javascript.capitalDelta}f`}
        isAnExpression
      />
      <div style={{ display: "flex", gap: "3px" }}>
        <MathML
          input={`(${unicodes.javascript.capitalDelta}f)/(${unicodes.javascript.capitalDelta}t) = (f(b) - f(a))/(b - a)`}
          isAnExpression
        />
        <div>= average rate of change of f(x) with respect to x.</div>
      </div>
      <div>These differences</div>
      <div style={{ display: "flex", gap: "5px" }}>
        <Link pathname="/math/calculus/derivative" style={{ color: "#5662F6" }}>
          Derivative
        </Link>
      </div>
    </div>
  );
};
