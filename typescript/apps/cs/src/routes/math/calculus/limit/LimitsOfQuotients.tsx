import { MathML } from "@packages/mathml";
import { StyledLink } from "../../../../styledComponents/StyledLink";
import { StyledMainTitle, StyledSubTitle } from "../../../../styledComponents/StyledMainTitle";
import { dynatic } from "../../../../dynatic-css.config";

export const LimitsOfQuotients = () => {
  return (
    <div>
      <StyledMainTitle>Limits of quotients</StyledMainTitle>
      <div
        className={dynatic`
          display: flex;
          gap: 3px;
          flex-wrap: wrap;
        `}
      >
        <div>On the</div>
        <StyledLink pathname="/math/calculus/limit/laws">Limits laws</StyledLink>
        <div>
          page we mentioned that the division of two limits is working as one would expect as long
          as the denominator isn't equal to 0.
        </div>
        <div>On other cases, we have to take different approaches in order to calculate them:</div>
      </div>
      <StyledSubTitle>
        If the limit of the denominator is 0 but the limit of the numerator isn't zero:
      </StyledSubTitle>
      <div>
        We end up dividing a non-zero value by a value that gets smaller and smaller (that gets
        closer and closer to zero), which means that the quotient gets larger and larger as x
        approaches the value.
      </div>
      <div
        className={dynatic`
          display: flex;
          gap: 3px;
          align-items: center;
        `}
      >
        <div>For further explanations and examples, you can visit the</div>
        <StyledLink pathname="/math/calculus/limit/limits-that-are-infinite">
          Limits that are infinite
        </StyledLink>
        <div>page.</div>
      </div>
      <div>
        Due to that, we can make sure that the quotient isn't approaching any fixed number, and
        thus, we can deduce from that that the limit does not exist.
      </div>
      <StyledSubTitle>
        If the limits of both the denominator and numerator are equal to zero:
      </StyledSubTitle>
      <div
        className={dynatic`
          display: flex;
          gap: 3px;
          align-items: center;
          flex-wrap: wrap;
        `}
      >
        <div>We can take for example the following quotient:</div>
        <MathML input="lim(x→0)2x/x" />
        <div>
          Since we are looking at it from a limits perspective, x = 0 doesn't matter, and in any
          other case, the denominator and the numerator would not be exactly equal to zero, and
          because of that, we can calculate that the limit would be equivalent to 2.
        </div>
        <div>
          That means that in this case, in order to know if the limit might or might not exist, more
          work is necessary to determine that.
        </div>
      </div>
      <StyledSubTitle>Let's take an example:</StyledSubTitle>
      <MathML input="lim(x→1)(x^2+2x-3)/(x^2-3x+2)" />
      <div>
        Both denominator and numerators' limits are equal to 0. Since both of them are polynomials,
        most of the time we will have to do factorization.
      </div>
      <MathML input="lim(x→1)((x-1)(x+3))/((x-1)(x-2))" />
      <div>Since both have a common factor, we can remove it:</div>
      <MathML input="lim(x→1)((x+3))/((x-2)) = -4" isAnExpression />
      <StyledSubTitle>And another one:</StyledSubTitle>
      <MathML input="lim(x→-1)(x+1)/(x+1/x+2)" />
      <div>
        Both denominator and numerators' limits are equal to 0. We need to slightly adjust both of
        them to be able to factor them with ease by multilying both the bottom and the top with x.
      </div>
      <MathML input="lim(x→-1)(x^2+x)/(x^2+1+2x)" />
      <div>And then factor it:</div>
      <MathML input="lim(x→-1)(x(x+1))/((x+1)^2)" />
      <div>
        Since the top's limit is -1 and the bottom 0, we can deduce from that, that the limit to a
        fixed number doesn't exist.
      </div>
    </div>
  );
};
