import { CalculationsTable } from "@packages/calculations-table";
import { MathML } from "@packages/mathml";
import { StyledLink } from "../../../../styledComponents/StyledLink";

export const Limit = () => {
  return (
    <div>
      <h3>Limits</h3>
      <div>
        A limit is the value received when a variable of a function is approaching a certain value
        through a range of values.
      </div>
      <div>
        When speaking of limits, we don't refer to when the variable is equal to the approaching
        value, as sometimes the function may even be undefined when x equals the value.
      </div>
      <div>
        If we assume that the function's graph is smooth, then calculating a couple of values that
        get closer and closer to the approaching value, could get us to figure out the function's
        limit when x approaches the value.
      </div>
      <h4>One sided limits</h4>
      <h5>Right-handed limit</h5>
      <div>
        When the variable is approaching from the right, it is referred as a{" "}
        <b>right-handed limit</b>.<div>For example:</div>
        <MathML input="lim(x→1+)sqrt(3 - 5x + x^2 + x^3)/(x - 1)" isAnExpression />
        <div>
          We can tell that the function is undefined on x = 1, but that is irrelevant as mentioned
          earlier, as we only care about the values of x that are bigger than 1.
        </div>
        <div>Let's calculate the right-handed limit:</div>
        <CalculationsTable
          columns={["x", "fx"]}
          data={[
            { x: 2, fx: 2.24 },
            { x: 1.5, fx: 2.12 },
            { x: 1.1, fx: 2.02 },
            { x: 1.01, fx: 2.002 },
          ]}
        />
        <div>
          We can deduce from that, the while x is approaching 1 from the right, f of x approaches 2.
        </div>
      </div>
      <h5>Left-handed limit</h5>
      <div>
        When the variable is approaching from the left, it is referred as a <b>left-handed limit</b>
        .<div>Let's take the same example from last time, and calculate its left-handed limit:</div>
        <MathML input="lim(x→1-)sqrt(3 - 5x + x^2 + x^3)/(x - 1)" isAnExpression />
        <CalculationsTable
          columns={["x", "fx"]}
          data={[
            { x: 0, fx: -1.73 },
            { x: 0.5, fx: -1.87 },
            { x: 0.9, fx: -1.97 },
            { x: 0.99, fx: -1.997 },
          ]}
        />
        <div>
          We can deduce from that, the while x is approaching 1 from the left, f of x approaches -2.
        </div>
      </div>
      <div>
        From this example we can see, that the limits of each of the sides don't necessarily have to
        be equal to each other.
      </div>
      <b>
        Keep, in mind, it is possible for one of the sides to be defined while the other to be
        undefined. It is also possible for both sides to have different limit values and for the
        function itself on the same value to be undefined or be equal to a completely different
        number.
      </b>
      <h3>The definition of limit</h3>
      <div>
        If a function approaches the same value from both left and right then the limit of the
        function exists and it is equal to the value on both ends.
      </div>
      <div>In other words:</div>
      <MathML input="lim(x→a+)f(x) = lim(x→a-)f(x) = L" isAnExpression />
      <div>Then:</div>
      <MathML input="lim(x→a)f(x) = L" isAnExpression />
      <h5>Formal definition:</h5>
      <div style={{ display: "flex", gap: "1px" }}>
        For all ε{">"}0, there exists some δ{">"}0 such as if 0 {"<"}
        <MathML input="|x - a|" />
        {"<"}δ, then <MathML input="|f(x) - L|" />
        {"<"}ε.
      </div>
      <b>
        In a graph that represents a function, a full circle in a point A is the value of f(x) when
        x is equal to A. Empty circles are the limits, and if there are multiple empty circles for
        the same A value then that means that there are different values to the right-handed limit
        and the left-handed limit.
      </b>
      <div>
        Keep in mind:{" "}
        <b>
          If a value is constantly changing or endlessly growing/decreasing as X approaches a, that
          means that the limit for that approached value does not exist. Only if the value gets
          closer and closer to a certain value as X approaches a, then it is possible to deduce that
          the limit is defined.
        </b>
      </div>
      <div>
        Also,{" "}
        <b>
          If f(x) exists on point A, that doesn't necessarily mean that the limit of the function as
          it approaches A exists.
        </b>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <StyledLink pathname="/math/calculus/limit/laws">Limit laws</StyledLink>
        <StyledLink pathname="/math/calculus/continuity">Continuity</StyledLink>
        <StyledLink pathname="/math/calculus/derivative">Derivative</StyledLink>
      </div>
    </div>
  );
};
