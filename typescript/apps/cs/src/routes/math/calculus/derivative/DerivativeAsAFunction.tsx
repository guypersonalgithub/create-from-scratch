import { StyledLink } from "../../../../styledComponents/StyledLink";

export const DerivativeAsAFunction = () => {
  return (
    <div>
      <h3>Derivative as a function</h3>
      <div>
        In order to figure out the function structure of a derivative, there are a couple of things
        one should ensure:
      </div>
      <ul>
        <li>
          If a part of a function is a straight line, that means that part has a consistent
          derivative that doesn't change its value.
        </li>
        <li>If a part of a function is horizontal, that means the derivative is equal to 0.</li>
        <li>
          If a part of a function is a corner, that means the function has no derivative at that
          point (as mentioned in{" "}
          <StyledLink pathname="/math/calculus/derivative/geometric-derivative-interpretation">
            Geometric derivative interpretation
          </StyledLink>
          ).
        </li>
        <li>
          When the function is moving up the Y axis, that means the derivative is positive, and when
          it is moving down the Y axis, that means the derivative is negative.
        </li>
      </ul>
      <div>
        Adding a constant to a function wouldn't change its tangent lines by the shift, even though
        both the graph and the tangent lines would go up or down. Because of that, the derivatives
        would remain <b>exactly the same</b>.
      </div>
      <div>
        When a graph is nice and smooth, without any discontinuities, corners, or other weird
        behavior, we can find the slope of the tangent line at any point.{" "}
        <b>Thus we can think of the derivative of a function as a function</b>.
      </div>
    </div>
  );
};
