import { MyersStepVisualizer } from "@packages/myers-visualizer";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { myersConstants } from "./constants";
import { StyledLink } from "../../../styledComponents/StyledLink";

export const Backtracking = () => {
  const { traces } = myersConstants;

  return (
    <>
      <StyledMainTitle>Backtracking</StyledMainTitle>
      <div>
        Once we reached the final step, we can look at the data that was recorded in <b>reverse</b>{" "}
        to figure out which path led to the result.
      </div>
      <div>
        The x values we've recorded record the best values of x we can reach for each (d, k)
        position.
      </div>
      <div>
        For instance, in the previous example within the{" "}
        <StyledLink pathname="/algorithms/myers/algorithmTheory">Myers Algorithm Theory</StyledLink>:
      </div>
      <MyersStepVisualizer trace={traces} isSwitched />
      <div>
        We know that the final position is at (x, y) = (4, 4), as (d, k) = (4, 0), so we can track
        back to either (3, 1) or (3, -1).
      </div>
      <div>
        (3, 1)'s x is 4 and (3, -1)'s is 3, so (3, 1) has a higher x value, so we must have reached
        (4, 0) via a downward move from there. This tells us that the (x, y) position before (4, 4)
        was (4, 3).
      </div>
      <MyersStepVisualizer trace={traces} isSwitched keepPathsOf={[7]} />
      <div>
        Via a similar argument, to move back from (d, k) = (3, 1) we must have come from (2, 2) or
        (2, 0).
      </div>
      <div>
        (2, 2)'s x is 3 while (2, 0)'s x is 2, so we know we reached here from (2, 2) via a downward
        move from (x, y) = (3, 1).
      </div>
      <MyersStepVisualizer trace={traces} isSwitched keepPathsOf={[7, 4]} />
      <div>
        Before that we are at the edge of the grid and thus can only have made rightward moves
      </div>
      <MyersStepVisualizer trace={traces} isSwitched keepPathsOf={[7, 4, 2, 0]} />
      <div>
        We have walked all the way back to the start and now we know that the (x, y) positions of
        each move are:
      </div>
      <div>
        (0, 0) {"->"} (2, 1) {"->"} (3, 1) {"->"} (4, 3) {"->"} (4, 4)
      </div>
      <div>
        These positions are enough to figure out the diagonal moves between each position - we
        decrement both x and y until one of them is equal to the values in the previous position,
        then we end up a single donward or rightward move away from that position.
      </div>
      <div>
        For example, to get from (4, 3) back to (3, 1) we step diagonally back to (3, 2). Since we
        have the same x value we must take an upward step from (3, 2) to (3, 1) to complete the
        move.
      </div>
    </>
  );
};
