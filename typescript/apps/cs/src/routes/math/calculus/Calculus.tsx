import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { SubRouter } from "@packages/router";
import { Limit } from "./limit/Limit";
import { Continuity } from "./continuity/Continuity";
import { Derivative } from "./derivative/Derivative";
import { StyledLinksContainer } from "../../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../../useStickSubRouterLinksToTop";
import { dynatic } from "../../../dynatic-css.config";

export const Calculus = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerClassName={dynatic`
          position: sticky;
          margin-top: -8px;
        `}
        links={[
          { path: "/math/calculus", children: "Calculus" },
          { path: "/math/calculus/limit", children: "Limit" },
          { path: "/math/calculus/continuity", children: "Continuity" },
          { path: "/math/calculus/derivative", children: "Derivative" },
        ]}
      />
      <SubRouter
        paths={{
          "/": (
            <div>
              <StyledMainTitle titleWrapper="h1">Calculus</StyledMainTitle>
              <div>
                Calculus' is mainly based on <b>derivaties</b> and <b>integrals</b>.
              </div>
              <div>
                In order to fully understand them, it is required first to learn about <b>limits</b>
                .
              </div>
              <StyledMainTitle>Relation to derivatives</StyledMainTitle>
              <div>
                If we draw two dots on a curve and move one of them closer and closer to the other,
                which is an example of a limit.
              </div>
              <div>
                In the limit, the connection line between the two points becomes tangent to the
                curve, at the location of the first point that wasn't moved.
              </div>
              <div>The slope of that line, is the derivative at that point.</div>
              <StyledMainTitle>Relation to integrals</StyledMainTitle>
              <div>Integrals are used to measure areas of curvy regions.</div>
              <div>
                As calculating the size of rectangle areas is easier, we can fill the curvy areas
                with rectangles. The smaller their size, the closer the total area of the rectangles
                get to that of the curvy area.
              </div>
              <div>
                The integral is the limit of the total area of the rectangles as the width tends to
                zero.
              </div>
            </div>
          ),
          "/limit!": <Limit />,
          "/continuity!": <Continuity />,
          "/derivative!": <Derivative />,
        }}
      />
    </div>
  );
};
