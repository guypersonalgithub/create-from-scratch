import { MathML, unicodes } from "@packages/mathml";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";

export const SecantLine = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[{ path: "/math/tangent-line", children: "Tangent line" }]}
      />
      <StyledMainTitle>Secant line</StyledMainTitle>
      <div>The secant line is a straight line created by two points of a curve.</div>
      <div>As both are brought together, the secant line tends to the tangent line.</div>
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
    </div>
  );
};
