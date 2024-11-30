import { Link } from "@packages/router";
import { MathML } from "@packages/mathml";
import { CalculationsTable } from "@packages/calculations-table";

export const LimitsThatAreInfinite = () => {
  return (
    <div>
      <h3>Limits that are infinite</h3>
      <div>
        Limits that aren't numbers technically don't exist, however, we sometimes want to know why
        is that.
      </div>
      <div>For instance:</div>
      <MathML input="lim(x→0+)1/x" />
      <div>
        We can tell the limit doesn't actually exist, but what actually happens to the function as x
        gets closer and closer to 0?
      </div>
      <CalculationsTable
        columns={["x", "fx"]}
        data={[
          { x: 1, fx: 1 },
          { x: 0.5, fx: 2 },
          { x: 0.1, fx: 10 },
          { x: 0.01, fx: 100 },
          { x: 0.001, fx: 1000 },
        ]}
      />
      <div>
        We can see that the smaller x gets, the higher the value becomes. Because of that, we can
        say that the theoretical limit of the function when x approaches 0 from the right is +∞
      </div>
      <h3>Figuring out if the limit actually exists</h3>
      <div>
        As mentioned earlier in the limit page, in order to dictate if a function has a limit or
        not, both sides of the limit should be approaching the same value.
      </div>
      <div>
        Because of that, we will have to check what happens to the function when x approaches the
        value from both sides and check if both limits are the same or not.
      </div>
      <Link pathname="/math/calculus/limit/limits-of-quotients" style={{ color: "#5662F6" }}>
        Limits of quotients
      </Link>
    </div>
  );
};
