import { MathML } from "@packages/mathml";
import { Link } from "@packages/router";

export const Continuity = () => {
  return (
    <div>
      <h3>Continuity</h3>
      <div>
        A function can be called continuous at the point x equals to a if the <b>limit</b> of f(x)
        is equal to the same value of the value of f(x).
      </div>
      <div style={{ display: "flex" }}>
        <MathML input="lim(x→a)f(x)" format="HTML" />
        <div>=</div>
        <MathML input="f(a)" format="HTML" />
      </div>
      <div>
        If we know that a function is continuous when x equals a, we can just calculate f(a) instead
        of calculating the limit in order to know what the limit is.
      </div>
      <h4>One sided continuity</h4>
      <h5>Right-continuous function:</h5>
      <div>
        A function that its limit from the right of a is equal to the value of the function when x
        equals a means that the function is right-continuous at a.
      </div>
      <div style={{ display: "flex" }}>
        <MathML input="lim(x→a+)f(x)" format="HTML" />
        <div>=</div>
        <MathML input="f(a)" format="HTML" />
      </div>
      <h5>Left-contiuous function:</h5>
      <div>
        Similarly to the right-continuous explanation, a function that its limit fro mthe left of a
        is equal to the value of the function when x equals a means that the function is
        left-continuous at a.
      </div>
      <div style={{ display: "flex" }}>
        <MathML input="lim(x→a-)f(x)" format="HTML" />
        <div>=</div>
        <MathML input="f(a)" format="HTML" />
      </div>
      <b>
        In order for a function to be treated as continuous overall, it needs to be both
        right-continuous and left-continuous at the point which x approaches.
      </b>
      <h3>Discontinuity</h3>
      <div>
        Due to the previous explanations mentioned, we can deduce that if a function's graph is
        going to jump at a certain point then that means it cannot be called a continuous function
        at the approaching point.
      </div>
      <div>
        If the left hand limit and right hand limit of a function both exist at a point x = a but
        are not equal, we can say that the function has a <b>jump discontinuity</b> at x = a.
      </div>
      <div>
        If the overall limit of a function when x approaches a exists, but the overall limit does
        not equal the function's value when x = a, then we can say the function has a{" "}
        <b>removable discontinuity</b> at x = a.
      </div>
      <h3>Overall continuity</h3>
      <div>
        If a function happens to be continuous at every point, it can be called continuous on the
        real line, or continuous everywhere.
      </div>
      <div>
        If a function is mentioned to be continuous without specifying a point, that means it means
        its <b>continuous everywhere</b>.
      </div>
      <div>
        Similarly to what was mentioned everywhere, a function that is continuous everywhere is a
        function that its limit on any point would be equal to the value of the function at that
        point.
      </div>
      <h4>Functions that can always be treated as continuous everywhere at all real numbers:</h4>
      <ul>
        <li>Constant functions - for example f(x) = 3.</li>
        <li>Functions similar to f(x) = x.</li>
        <li>Functions similar to f(x) = |x|.</li>
        {/*root(x,3)*/}
        <li>
          Trignometric functions such as sinx or cosx. tanx isn't continuous everywhere as when x
          equals half a pi, cos equals 0, which means that there are points where tanx is not
          defined. (its continuous only at places where its defined.)
        </li>
        <li>Polynomials - for example f(x) = 3x + 5.</li>
        <li>
          <div style={{ display: "flex", gap: "5px" }}>
            <MathML input="a^x" format="HTML" />
            <div>when a {">"} 0.</div>
          </div>
        </li>
        <li>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <MathML input="sqrt(x)" format="HTML" />
            <div>when x {">"} 0 or = 0.</div>
          </div>
        </li>
        <li>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <MathML input="log(a,x)" format="HTML" />
            <div>
              when x {">"} 0 and a {">"} 0.
            </div>
          </div>
        </li>
      </ul>
      <div style={{ display: "flex", gap: "5px" }}>
        <Link pathname="/math/calculus/limit/laws" style={{ color: "#5662F6" }}>
          Limit laws
        </Link>
        <Link pathname="/math/calculus/limit" style={{ color: "#5662F6" }}>
          Limit
        </Link>
        <Link
          pathname="/math/calculus/continuity/intermediate-value-theorem"
          style={{ color: "#5662F6" }}
        >
          Intermediate value theorem
        </Link>
      </div>
    </div>
  );
};
