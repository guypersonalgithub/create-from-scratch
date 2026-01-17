import { MathML } from "@packages/mathml";
import { StyledInteractiveTitle } from "../../../styledComponents/StyledInteractiveTitle";
import { dynatic } from "../../../dynatic-css.config";

export const LinearSpaceAlgorithm = () => {
  return (
    <div>
      <StyledInteractiveTitle>Linear Space Algorithm</StyledInteractiveTitle>
      <div>
        The original Myers' diff algorithm takes a quadratic amount of space to calculate the edit
        sequence. It iterates over all potentially possible paths and saves the deltas of every
        reached spot on every step, before backtracking to an ideal edit sequence.
      </div>
      <div
        className={dynatic`
          display: flex;
          gap: 4px;
        `}
      >
        Because of that, in the worst case scenario, it would take both lengths of the given inputs
        to traverse the graph <MathML input="(N + M)" />, and so the algorithm would require space
        proportional to
        <MathML input="(N + M) ^ 2" />.
      </div>
      <div>
        Fortunately, Myers presented a modified version of his algorithm that runs in linear space,
        that is proportional to the sum of the inputs' lengths.
      </div>
      <div>
        While the original algorithm deterministically walks from the top left to the bottom right
        in a single pass, the linear space version uses a <b>divide and conquer</b> approach.
      </div>
      <div>
        The edit sequence is made up of a series of what Myers calls snakes. A snake a rightward or
        downward step followed by zero or more diagonal ones.
      </div>
      <div>
        The linear space version works by finding the middle snake of a possible edit path, that
        crosses the halfway distance from top left to bottom right, and using the endpoints of that
        to divide the original graph into two smaller regions.
      </div>
      <div>
        Afterwards, it works recursively until the regions are so small that no further work is
        required.
      </div>
    </div>
  );
};
