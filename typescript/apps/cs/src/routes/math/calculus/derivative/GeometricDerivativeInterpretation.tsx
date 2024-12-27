import { MathML, unicodes } from "@packages/mathml";
import { Table } from "@packages/table";
import { StyledLink } from "../../../../styledComponents/StyledLink";
import { StyledMainTitle, StyledSubTitle } from "../../../../styledComponents/StyledMainTitle";

export const GeometricDerivativeInterpretation = () => {
  return (
    <div>
      <StyledMainTitle>Geometric derivative interpretation</StyledMainTitle>
      <div>
        Following the description in{" "}
        <StyledLink pathname="/math/tangent-line">Tangent line</StyledLink>
        <div style={{ display: "flex", gap: "3px" }}>
          we can find the slope of a tangent(m) line with calculus as{" "}
          <MathML input="m = f'(a)" isAnExpression />.
        </div>
      </div>
      <div>
        We can check the <StyledLink pathname="/math/secant-line">Secant line</StyledLink>
        page to see how we can find a secant line of a curved function between two points.
      </div>
      <div>
        The given expression seems a bit familiar, doesn't it? You might have already encountered
        this interpretation in the average rate of change section in the{" "}
        <StyledLink pathname="/math/calculus/derivative">Derivative</StyledLink> section, as we are
        trying to find the changes in y and x between these points, and if point 1's x is a, its y
        would be f(a), and also if the point 2's x is b, its y would be f(b).
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
      <div>The closer the points get, the closer the secant line becomes to the tangent line.</div>
      <Table
        containerStyle={{ width: "fit-content" }}
        headerContainer={{
          backgroundColor: "#242424",
          borderBottom: "1px solid #383232",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
        rows={{
          dataRow: {
            size: 50,
          },
        }}
        dataRowStyle={() => {
          return {
            paddingLeft: "10px",
            paddingRight: "10px",
          };
        }}
        columnStyle={(index) => {
          if (index === 0) {
            return;
          }

          return {
            borderLeft: "1px solid #383232",
            paddingLeft: "10px",
          };
        }}
        columns={[
          {
            header: "Interpretation",
            cell: (row) => {
              return <div>{row.interpretation}</div>;
            },
            size: 110,
          },
          {
            header: "Secant line",
            cell: (row) => {
              return <div>{row.secant}</div>;
            },
            size: 175,
          },
          {
            header: "",
            cell: () => {
              return (
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", fontSize: "40px", top: -40 }}>
                    {unicodes.javascript.arrow}
                  </div>
                  <div style={{ position: "absolute", top: 0, fontSize: "13px", left: "5px" }}>
                    b{unicodes.javascript.arrow}a
                  </div>
                </div>
              );
            },
            size: 50,
          },
          {
            header: "Tangent line",
            cell: (row) => {
              return <div>{row.tangent}</div>;
            },
            size: 200,
          },
        ]}
        data={[
          { interpretation: "Geometric", secant: "slope", tangent: "slope" },
          {
            interpretation: "Symbolic",
            secant: <MathML input={`(f(b) - f(a))/(b - a)`} />,
            tangent: <MathML input="f'(a)" isAnExpression />,
          },
          {
            interpretation: "Phystical",
            secant: "Average rate of change",
            tangent: "Instantenous rate of change",
          },
        ]}
      />
      <div>
        If we go back to the theoretical issue of the object thrown from a high place on the{" "}
        <StyledLink pathname="/math/calculus/derivative">Derivative</StyledLink> page, we can now
        calculate the slope of the tangent line of each point of the curvy graph of the movement of
        the thrown object. With some calculations, we can tell that the slope of the tangent is
        equivalent to the derivative of the function on each point calculated.
      </div>
      <StyledSubTitle>Secant line for a line</StyledSubTitle>
      <div>
        If the graph of f is a line, the slope of its secant line would be equivalent to the slope
        of the line itself. Same could be said about the slope of its tangent.
      </div>
      <StyledSubTitle>When the tangent line doesn't exist</StyledSubTitle>
      <div>
        The slope of a tangent line which is known as the derivative{" "}
        <b>only exists if the tangent line exists</b>.
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        <div>For example:</div>
        <MathML input="f(x) = |x|" isAnExpression />
        <div>
          doesn't have a tangent on its origin (x = 0), thus it has no derivative aswell on that
          point.
        </div>
      </div>
      <StyledSubTitle>Right and left limits</StyledSubTitle>
      <div>
        Let's take the previous function and find its left and right handed{" "}
        <StyledLink pathname="/math/calculus/limit">limits</StyledLink> of the secant:
      </div>
      <MathML input="f(x) = |x|" isAnExpression />
      <div>
        First, in order to get the limit of the secant (as in the derivative), we need to use the
        average rate of change formula:
      </div>
      <MathML
        input={`(${unicodes.javascript.capitalDelta}f)/(${unicodes.javascript.capitalDelta}x) = (f(x) - f(0))/(x - 0)`}
        isAnExpression
      />
      <div>
        Now, we need to check what happens on the left side and the right side as x approaches 0:
      </div>
      <MathML input="lim(x→0+)=(|x|-0)/(x-0)" isAnExpression />
      <div>
        The fraction is from a 0/0 type, so we'll use the third option mentioned in{" "}
        <StyledLink pathname="/math/calculus/limit/limits-of-quotients">
          Limits of quotinents
        </StyledLink>
        :
      </div>
      <MathML input="lim(x→0+)=(x-0)/(x-0) = x/x = 1" isAnExpression />
      <div>And the same goes for the left hand limit:</div>
      <MathML input="lim(x→0-)=(x-0)/(-x-0) = x/-x = -1" isAnExpression />
      <div>Because both limits aren't equal, the overall limit at 0 doesn't exist.</div>
      <div>As the derivative is the overall limit, the derivative doesn't exist either.</div>
      <div>Since f'(0) doesn't exist we can say f is not differentiable at x = 0.</div>
      <div>
        Similarly to limits, a left-handed limit is a left-sided derivative, and a right-handed
        limit is a right-sided derivative.
      </div>
      <MathML input="lim(x→0+)=(f(x)-f(0))/(x-0) = f'(0+)" isAnExpression />
      <MathML input="lim(x→0-)=(f(x)-f(0))/(x-0) = f'(0-)" isAnExpression />
      <StyledSubTitle>Jump discontinuity</StyledSubTitle>
      <div>Corners aren't the only points where a function might not be differentiable.</div>
      <div>
        Step functions such as f(x) = {unicodes.javascript.leftFloor}x
        {unicodes.javascript.rightFloor} don't have a tangent at the start of each step.
      </div>
      <StyledSubTitle>Important derivative/tangent rules</StyledSubTitle>
      <div>If a function f is not continuous a x = a, then f is not differentiable at a.</div>
      <div>
        In other words - if a function has a discontinuty at a point, it can't have a tangent line
        and so it can't be differentiable. However, if a function is continuous it might not be
        differentiable, because it might have for example a corner which doesn't have a tangent
        line, like the case of f(x) = |x|.
      </div>
      <div>
        There might, however, be cases where there is no derivative but there is a tangent line (as
        in the derivative being undefined).
      </div>
      <div>The only case that happens is for vertical tangent lines.</div>
      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <div>For example:</div>
        <MathML input="f(x) = root(x,3)" isAnExpression />
        <div>
          at x = 0 there is a vertical line, so as the slope is infinite there is no derivative.
        </div>
      </div>
    </div>
  );
};
