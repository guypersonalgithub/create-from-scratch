import { Link } from "@packages/router";
import { MathML } from "@packages/mathml";

export const LimitsOfQuotients = () => {
  return (
    <div>
      <h3>Limits of quotients</h3>
      <div style={{ display: "flex", gap: "3px" }}>
        <div>On the</div>
        <Link pathname="/math/calculus/limit/laws">Limits laws</Link>
        <div>
          page we mentioned that the division of two limits is working as one would expect as long
          as the denominator isn't equal to 0.
        </div>
        <div>On other cases, we have to take different approaches in order to calculate them:</div>
      </div>
      <h4>If the limit of the denominator is 0 but the limit of the numerator isn't zero:</h4>
      <div>
        We end up dividing a non-zero value by a value that gets smaller and smaller (that gets
        closer and closer to zero), which means that the quotient gets larger and larger as x
        approaches the value.
      </div>
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        <div>For further explanations and examples, you can visit the</div>
        <Link pathname="/math/calculus/limit/limits-that-are-infinite">
          Limits that are infinite
        </Link>
        <div>page.</div>
      </div>
      <div>
        Due to that, we can make sure that the quotient isn't approaching any fixed number, and
        thus, we can deduce from that that the limit does not exist.
      </div>
      <h4>If the limits of both the denominator and numerator are equal to zero:</h4>
      <div style={{ display: "flex", gap: "3px", alignItems: "center", flexWrap: "wrap" }}>
        <div>We can take for example the following quotient:</div>
        <MathML input="lim(x→0)2x/x" format="HTML" />
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
      <h5>Let's take an example:</h5>
      <MathML input="lim(x→1)(x^2+2x-3)/(x^2-3x+2)" format="HTML" />
      <div>
        Both denominator and numerators' limits are equal to 0. Since both of them are polynomials,
        most of the time we will have to do factorization.
      </div>
      <MathML input="lim(x→1)((x-1)(x+3))/((x-1)(x-2))" format="HTML" />
      <div>Since both have a common factor, we can remove it:</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <MathML input="lim(x→1)((x+3))/((x-2))" format="HTML" />
        <div>= -4</div>
      </div>
      <h5>And another one:</h5>
      <MathML input="lim(x→-1)(x+1)/(x+1/x+2)" format="HTML" />
      <div>
        Both denominator and numerators' limits are equal to 0. We need to slightly adjust both of
        them to be able to factor them with ease by multilying both the bottom and the top with x.
      </div>
      <MathML input="lim(x→-1)(x^2+x)/(x^2+1+2x)" format="HTML" />
      <div>And then factor it:</div>
      <MathML input="lim(x→-1)(x(x+1))/((x+1)^2)" format="HTML" />
      <div>
        Since the top's limit is -1 and the bottom 0, we can deduce from that, that the limit to a
        fixed number doesn't exist.
      </div>
    </div>
  );
};
