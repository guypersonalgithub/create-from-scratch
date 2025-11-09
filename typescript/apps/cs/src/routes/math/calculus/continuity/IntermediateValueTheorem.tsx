import { MathML } from "@packages/mathml";
import { StyledMainTitle, StyledSubTitle } from "../../../../styledComponents/StyledMainTitle";
import { useStickSubRouterLinksToTop } from "../../../../useStickSubRouterLinksToTop";
import { StyledLinksContainer } from "../../../../styledComponents/StyledLinksContainer";
import { dynatic } from "../../../../dynatic-css.config";

export const IntermediateValueTheorem = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerClassName={dynatic`
          position: sticky;
          margin-top: -8px;
        `}
        links={[{ path: "/math/calculus/continuity", children: "Continuity" }]}
      />
      <StyledMainTitle>Intermediate value theorem</StyledMainTitle>
      <StyledSubTitle>Formal definition:</StyledSubTitle>
      <div>
        If f is a function which is continuous on the interval [a,b], and M lies between the values
        of f(a) and f(b), then there is at least one point c between a and b such that (f)c = M.
      </div>
      <div>
        In other words: if f is a continuous function on the closed interval [a,b], if it is
        right-continuous at a and left continuous at b, and continuous at all points between a and
        b.
      </div>
      <div>
        <b>In that scenario, there is atleast one point where f(x) = M.</b>
      </div>
      <StyledSubTitle>Using the IVT example:</StyledSubTitle>
      <div>Let's assume we have the following function:</div>
      <div
        className={dynatic`
          display: flex;
          gap: 5px;
        `}
      >
        <MathML input="x^4 - x - 1" />
        <div>
          and we would like to know if it has any roots (i.e. when its equal to 0) without
          necessarily knowing their values.
        </div>
      </div>
      <div>Since this is a polynomial, we already know that its continuous everywhere.</div>
      <div>
        If we can find two values that create an interval where 0 is within it, we can deduce with
        the IVT, that the functions passes through 0 atleast once, thus, that means the function has
        atleast one root.
      </div>
      <div>
        By assigning some values, we can see that f(1) = -1, and f(2) = 13, and from that, with the
        IVT, as mentioned earlier, we can tell the function has at the very least 1 root.
      </div>
    </div>
  );
};
