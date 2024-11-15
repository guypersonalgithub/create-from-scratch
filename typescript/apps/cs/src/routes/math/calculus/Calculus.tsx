import { Link } from "@packages/router";

export const Calculus = () => {
  return (
    <div>
      <h1>Calculus</h1>
      <div>
        Calculus' is mainly based on <b>derivaties</b> and <b>integrals</b>.
      </div>
      <div>
        In order to fully understand them, it is required first to learn about <b>limits</b>.
      </div>
      <h2>Relation to derivatives</h2>
      <div>
        If we draw two dots on a curve and move one of them closer and closer to the other, which is
        an example of a limit.
      </div>
      <div>
        In the limit, the connection line between the two points becomes tangent to the curve, at
        the location of the first point that wasn't moved.
      </div>
      <div>The slope of that line, is the derivative at that point.</div>
      <h2>Relation to integrals</h2>
      <div>Integrals are used to measure areas of curvy regions.</div>
      <div>
        As calculating the size of rectangle areas is easier, we can fill the curvy areas with
        rectangles. The smaller their size, the closer the total area of the rectangles get to that
        of the curvy area.
      </div>
      <div>
        The integral is the limit of the total area of the rectangles as the width tends to zero.
      </div>
      <Link pathname="/math/calculus" style={{ color: "#5662F6" }}>
        Limit
      </Link>
    </div>
  );
};
