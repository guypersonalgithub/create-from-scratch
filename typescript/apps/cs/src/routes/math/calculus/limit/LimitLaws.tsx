import { MathML } from "@packages/mathml";
import { StyledLink } from "../../../../styledComponents/StyledLink";
import { StyledMainTitle, StyledSubTitle } from "../../../../styledComponents/StyledMainTitle";

export const LimitLaws = () => {
  return (
    <div>
      <StyledMainTitle>Limit laws</StyledMainTitle>
      <StyledSubTitle>Addition between limits:</StyledSubTitle>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div>Let's assume that we have two functions with defined limits on value a:</div>
        <MathML input="lim(x→a)f(x) = 4" isAnExpression />
        <div>, and</div>
        <MathML input="lim(x→a)g(x) = 7" isAnExpression />
        <div>.</div>
        <div>
          Calculating the sum of both functions' limits is very simple, and it is equivalent to a
          simple addition, assuming they approach the same value.
        </div>
        <div>
          Since we know that as function gets closer and closer to its limit as x approaches closer
          and closer to a, we can ignore the slight differences and just sum between both limits
          like normal.
        </div>
        <div>That would mean that: </div>
        <MathML input="lim(x→a)f(x)+g(x) = 11" isAnExpression />
        <div>.</div>
      </div>
      <StyledSubTitle>Substraction between limits:</StyledSubTitle>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div>
          Similarly to addition, substraction works the same. That's why, the substraction between
        </div>
        <MathML input="lim(x→a)f(x)" />
        <div>and</div>
        <MathML input="lim(x→a)g(x)" />
        <div>is:</div>
        <MathML input="lim(x→a)f(x)-g(x) = -3" isAnExpression />
        <div>as one would expect.</div>
      </div>
      <StyledSubTitle>Multiplication between limits:</StyledSubTitle>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div>Once again, similarly to the previous examples, multiplication works the same.</div>
        <div>The multiplication between</div>
        <MathML input="lim(x→a)f(x)" />
        <div>and</div>
        <MathML input="lim(x→a)g(x)" />
        <div>is:</div>
        <MathML input="lim(x→a)f(x)*g(x) = 28" isAnExpression />
        <div>.</div>
      </div>
      <StyledSubTitle>Division between limits:</StyledSubTitle>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <div>
          Unlike the previous rules, division between limits is a bit different. If, for instance,
          we would like to divide between
        </div>
        <MathML input="lim(x→a)f(x)" />
        <div>and</div>
        <MathML input="lim(x→a)g(x)" />
        <div>
          , we have to make sure that the limit of g(x) isn't 0 when x approaches a, as if that
          happens, the division between limits behaves differently.
        </div>
        <div>
          However, when the denominator isn't equal to 0, a division between limits works just like
          one would expect. For example, the division between
        </div>
        <MathML input="lim(x→a)f(x)" />
        <div>and</div>
        <MathML input="lim(x→a)g(x)" />
        <div>is:</div>
        <MathML input="lim(x→a)(f(x))/(g(x)) = 4/7" isAnExpression />
        <div>.</div>
        <div style={{ display: "flex", gap: "3px" }}>
          <div>For division between limits where the denominator is equal to 0, head to the</div>
          <StyledLink pathname="/math/calculus/limit/limits-of-quotients">
            limits of quotients
          </StyledLink>
          <div>page.</div>
        </div>
      </div>
      <StyledMainTitle>Limit laws with continuity</StyledMainTitle>
      <StyledSubTitle>Addition between continuous functions:</StyledSubTitle>
      <div>
        If two functions are continuous everywhere, their sum is <b>continuous everywhere.</b>
      </div>
      <div>
        Because of that, we can assess the following example if both f(x) and g(x) are continuous
        everywhere:
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        <MathML input="f(x) = 4" isAnExpression />
        <div>, and</div>
        <MathML input="g(x) = 7" isAnExpression />
        <div>, then</div>
        <MathML input="f(x)+g(x) = 11" isAnExpression />
        <div>.</div>
      </div>
      <div>
        Keep in mind, that the values may change, depending on the value of x, as the functions
        aren't constants.
      </div>
      <StyledSubTitle>Substraction between continuous functions:</StyledSubTitle>
      <div>
        Similarly to addition, substraction also works the same, and the substraction between two
        functions that are continuous everywhere, is also <b>continuous everywhere</b>:
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        <MathML input="f(x) = 4" isAnExpression />
        <div>, and</div>
        <MathML input="g(x) = 7" isAnExpression />
        <div>, then</div>
        <MathML input="f(x)-g(x) = -3" isAnExpression />
        <div>.</div>
      </div>
      <StyledSubTitle>Multiplication between continuous functions:</StyledSubTitle>
      <div>
        And the same goes for multiplication, and the multiplication between two functions that are
        continuous everywhere is also <b>continous everywhere</b>:
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        <MathML input="f(x) = 4" isAnExpression />
        <div>, and</div>
        <MathML input="g(x) = 7" isAnExpression />
        <div>, then</div>
        <MathML input="f(x)*g(x) = 28" isAnExpression />
        <div>.</div>
      </div>
      <StyledSubTitle>Division between continuous functions:</StyledSubTitle>
      <div>
        Like regular limit laws, as long as the denominator isn't equal to zero, the division
        between two functions that are continuous everywhere is continuous <b>where its defined</b>:
      </div>
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        <MathML input="f(x) = 4" isAnExpression />
        <div>, and</div>
        <MathML input="g(x) = 7" isAnExpression />
        <div>, then</div>
        <MathML input="(f(x))/(g(x)) = 4/7" isAnExpression />
        <div>.</div>
      </div>
      <StyledSubTitle>
        In functions created out of{" "}
        <StyledLink pathname="/math/composition-of-functions">composition of functions</StyledLink>:
      </StyledSubTitle>
      <div>
        If all of the functions within the composition of functions are continuous everywhere, so
        will be the functions made out of them.
      </div>
      <StyledSubTitle>
        The sum of functions that have discontinuity won't necessarily have a discontinuity aswell:
      </StyledSubTitle>
      <div style={{ display: "flex", gap: "3px", alignItems: "center", flexWrap: "wrap" }}>
        <div>For instance:</div>
        <MathML input="f(x) = 1/x" isAnExpression />
        <div>and</div>
        <MathML input="g(x) = -1/x" isAnExpression />
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          <div>which means that both have a discontinuity at x = 0, yet</div>
          <MathML input="h(x) = f(x) + g(x)" isAnExpression />
          <div>would be 0 which is continuous.</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "3px", alignContent: "center", flexWrap: "wrap" }}>
        <div>For example we can tell that the following function:</div>
        <MathML input="sin(x^2+1)" />
        <div>is continuous everywhere, becaues both sin and</div>
        <MathML input="x^2 + 1" />
        <div>are continuous everywhere.</div>
      </div>
    </div>
  );
};
