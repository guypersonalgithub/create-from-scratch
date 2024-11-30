import { MathML, unicodes } from "@packages/mathml";
import { Link } from "@packages/router";

export const Derivative = () => {
  return (
    <div>
      <h3>Derivative</h3>
      <div>
        A derivative at a point is the <b>instantaneous rate of change</b>, and can be found through
        limits.
      </div>
      <h4>Example</h4>
      <div>
        Let's assume we want to find the average velocity of a car between 8:00 to 10:00 am if we
        know the position in 8:00 was 50 miles and at 10:00 220 miles.
      </div>
      <div>
        In order to calculate the average velocity, we need to take into consideration that a
        position is a function of time.
      </div>
      <div>That means that f(8) = 50, f(10) = 220.</div>
      <div>
        The special notation we use to denote the change in a variable is often displayed through
        Delta({unicodes.javascript.capitalDelta}) - it stands for <b>difference</b>.
      </div>
      <MathML
        input={`(${unicodes.javascript.capitalDelta}f)/(${unicodes.javascript.capitalDelta}t) = (f(10) - f(8))/(10 - 8) = (220 - 50)/(10 - 8) = 170/2 = 85mph`}
        isAnExpression
      />
      <div>
        In order to get the <b>closer</b> value to the immediate velocity of a specific time, we
        should calculate the differences of very close time instances, for example 8 AM and 8:01 AM.
      </div>
      <div style={{ display: "flex", gap: "3px" }}>
        Lets assume that
        <MathML input="f(8 + 1/60) = 51mph" isAnExpression />, then
      </div>
      <MathML
        input={`(${unicodes.javascript.capitalDelta}f)/(${unicodes.javascript.capitalDelta}t) = (f(8 + 1/60) - f(8))/(8 + 1/60 - 8) = (51 - 50)/(8 + 1/60 - 8) = 1/1/60 = 60mph`}
        isAnExpression
      />
      <div>
        That's why we can say that the average velocity per minute is treated as miles per hour, as
        the numerator is in miles, the denominator is in minutes, and by conversion into hours, we
        get the following:
      </div>
      <MathML
        input="(1miles)/(1minutes) = 1(miles)/(minutes) * 60(minutes/hours) = 60(miles/hours)"
        isAnExpression
      />
      <h4>Average rate of change</h4>
      <div>
        In general when having any function f with some input variable, then we can talk about the
        average rate of change of f of the variable with respect to the variable, as the variable
        goes from equals a to equals b
      </div>
      <div>Let's assume the variable is x.</div>
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        The average rate of change of a function f(x) over an interval{" "}
        <MathML
          input={`a${unicodes.javascript.lessThanEqual}x${unicodes.javascript.lessThanEqual}b`}
          isAnExpression
        />
        <div>is defined to be:</div>
      </div>
      <MathML
        input={`(${unicodes.javascript.capitalDelta}f)/(${unicodes.javascript.capitalDelta}t) = (f(b) - f(a))/(b - a)`}
        isAnExpression
      />
      <h4>Instantaneous rate of change - the derivative of a point</h4>
      <div>
        But what if the want to know the <b>exact</b> value of such at a very specific point?
      </div>
      <div>
        Similarly to how the difference of 1 minute is closer than of 2 hours, the closer we get to
        the initial point, the closer we get to the actual value at a specific point{" "}
        <b>without using the same exact value twice</b>, as that would just result in 0 over 0.
      </div>
      <div>Sounds familiar, doesn't it? - </div>
      <div>
        So the solution is to take a <b>limit</b> as the second point is approaching the first.
      </div>
      <MathML input="lim(b→8)(f(b)-f(8))/(b-8)" isAnExpression />
      <div>
        <b>
          Taking the limit of a bunch of average instantaneous rates of change of any function in
          order to get the specific instantangeous change of a certain point applies to everything.
        </b>
      </div>
      <div>
        The instantaneous rate of change of f(x) at x = a is called the <b>derivative</b> of f.
      </div>
      <div>
        In other words, the deravative at a point is measuring the instanteous rate of change of the
        function at that point.
      </div>
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        <div>
          The <b>derivative</b> of f(x) at x = a = the <b>Instantaneous rate of change</b> of f(x)
          at x = a =
        </div>
        <MathML input="f'(a) = lim(b→a)(f(b)-f(a))/(b-a)" isAnExpression />
      </div>
      <div>Alternative definition:</div>
      <MathML input="f'(a) = lim(h→0)(f(a + h)-f(a))/(h)" isAnExpression />
      <h5>Example:</h5>
      <div>
        Let's assume an object is thrown from a 100m building, and we want to the average velocity
        and instant velocity after 1 second.
      </div>
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
        Let's assume that 20t is the initial velocity, and
        <MathML input="-5t^2" />
        <div>
          is the effect of gravity, because we know that objects fall in parabolic arcs. Height at
          time t seconds =
        </div>
        <MathML input="f(t) = 100 + 20t - 5t^2 meters" isAnExpression />
      </div>
      <div>Average velocity between t=0 and t=1:</div>
      <MathML input="(f(1) - f(0))/(1 - 0) = (115 - 100)/1 = 15(m)/(s)" isAnExpression />
      <div>Instantaneous velocity at t=1:</div>
      <MathML
        input="f'(1) = lim(b→1)(f(b)-f(1))/(b-1) = (f(b) - f(1))/(b - 1) = ((100 + 20b - 5b^2) - 115)/(b - 1) = (-5b^2 + 20b - 15)/(b-1) = (-5(b^2-4b+3))/(b-1) = (-5(b-1)(b-3))/(b-1) = -5(b-3)"
        isAnExpression
      />
      <div>
        Since after calculations this is a polynomial, we can tell the function is{" "}
        <Link pathname="/math/calculus/continuity" style={{ color: "#5662F6" }}>
          continuous
        </Link>
        and from that we can tell that the limit at b = 1 is equivalent to f(1), so we can just
        calculate the value of f(1) in order to know the exact velocity.
      </div>
      <MathML input="lim(b→1)-5(b-3) = -5(-2) = 10(m)/(s)" isAnExpression />
      <div>Lets now calculate the average and instant velocities of t=3</div>
      <div>Average:</div>
      <MathML input="(f(3) - f(0))/(3 - 0) = (115 - 100)/3 = 5(m)/(s)" isAnExpression />
      <div>Instant:</div>
      <MathML
        input="f'(3) = lim(b→3)(f(b)-f(3))/(b-3) = (f(b) - f(3))/(b - 3) = ((100 + 20b - 5b^2) - 115)/(b - 3) = (-5b^2 + 20b - 15)/(b-3) = (-5(b^2-4b+3))/(b-3) = (-5(b-1)(b-3))/(b-3) = -5(b-1)"
        isAnExpression
      />
      <div>
        Once again,{" "}
        <Link pathname="/math/calculus/continuity" style={{ color: "#5662F6" }}>
          continuous
        </Link>
        , so we can tell what's the velocity from f(3)
      </div>
      <MathML input="lim(b→3)-5(b-1) = -5(2) = -10(m)/(s)" isAnExpression />
      <div>
        We can tell from that, that the average velocity is lower and that the derivative of f(3) is
        negative. Why is that? What does that mean?
      </div>
      <div>
        Since both f(1) and f(3) are at 115m, that means that the object we threw started falling
        down somewhere between f(1) and f(3), as it cannot just stay in place in the air.
      </div>
      <div>
        That means, that f'(1) is positive because of the object moving upwards, while f'(3) is
        negative because of the object moving downwards - the height f is increasing/decreasing.
      </div>
      <div>
        That means that the{" "}
        <b>sign of a derivative tells us the direction in which the function is changing</b>.
      </div>
      <div>In other words:</div>
      <div style={{ display: "flex", gap: "3px" }}>
        <div>if</div>
        <MathML input="f'(a)>0" isAnExpression />
        <div>, f is increasing at a, and if</div>
        <MathML input="f'(a)<0" isAnExpression />
        <div>, then f is decreasing at a.</div>
      </div>
      <div>Let's try to get the instant velocity at b=2:</div>
      <MathML
        input="f'(2) = lim(b→2)(f(b)-f(2))/(b-2) = (f(b) - f(2))/(b - 2) = ((100 + 20b - 5b^2) - 120)/(b - 2) = (-5b^2 + 20b - 20)/(b-2) = (-5(b^2-4b+4))/(b-2) = (-5(b-2)(b-2))/(b-2) = -5(b-2)"
        isAnExpression
      />
      <div>
        Same thing, polynomial ={" "}
        <Link pathname="/math/calculus/continuity" style={{ color: "#5662F6" }}>
          continuous
        </Link>
        , so lets calculate f(2):
      </div>
      <MathML input="lim(b→2)-5(b-2) = -5(0) = 0(m)/(s)" isAnExpression />
      <div>What does a 0 derivative mean?</div>
      <div>
        If a positive derivative = f increasing, negative derivative = f decreasing, then when the
        derivative is 0, that means the object reached the top of its trajectory, has stopped going
        up, but hasn't quite started to go down.
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <Link pathname="/math/calculus/limit" style={{ color: "#5662F6" }}>
          Limit
        </Link>
        <Link
          pathname="/math/calculus/derivative/geometric-derivative-interpretation"
          style={{ color: "#5662F6" }}
        >
          Geometric derivative interpretation
        </Link>
      </div>
    </div>
  );
};
