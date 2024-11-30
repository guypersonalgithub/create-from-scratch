import { MathML } from "@packages/mathml";
import { Link } from "@packages/router";

export const TangentLine = () => {
  return (
    <div>
      <h3>Tangent line</h3>
      <div>In order to get a tangent's line equation, we need both a point and its slope.</div>
      <div style={{ display: "flex", gap: "3px", alignItems: "center", flexWrap: "wrap" }}>
        <div>A tangent line for the function</div>
        <MathML input="y=f(x)" isAnExpression />
        <div>
          let's assume that the point a is the intersection point between the function and the
          tangent line.
        </div>
        <div>
          Then we can assess that the point we need is potentially point(x0, y0) = (a, f(a)), and
          the slope m.
        </div>
        <div>Then we can say the tangent line is - </div>
        <MathML input="y-y1 = m(x-x1) = y-f(a) = m(x-a)" isAnExpression />
        <div>
          <b>
            Treating tangent as a line that touches a curve in only one point is a bad definition
            for a tangent.
          </b>
        </div>
        <div>
          When zooming enough on a function, the function is supposed to look like a line, similarly
          to the tangent line at the same point, and they are supposed to have the same slope at the
          same point and point at the same direction.
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <Link pathname="/math/secant-line" style={{ color: "#5662F6" }}>
          Secant line
        </Link>
      </div>
    </div>
  );
};
