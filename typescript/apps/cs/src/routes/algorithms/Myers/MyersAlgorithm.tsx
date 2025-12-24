import { MyersStepVisualizer } from "@packages/myers-visualizer";
import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";

export const MyersAlgorithm = () => {
  return (
    <>
      <StyledMainTitle>Myers Algorithm</StyledMainTitle>
      <div>
        For each k, we create a range of [-d, +d], which k should be inside said range. This is a
        specific range that is thought of precisely because we may only do a maximum amount of d
        actions to reach the current k.
      </div>
      <div>
        For instance, for d = 2, we can't suddenly have a k = 4, but k can be for instance, a -2, 0
        or 2 (it cannot be a 1 or a -1 because each specific step should increase or decrease k, and
        since d is even, and each step increases of decreases by one value each step, it will
        impossible for an even step to result in an uneven k, or for an uneven step to result in an
        even k).
      </div>
      <div>
        The algorithm is beginning with step 0, requires us to move every step from -d to +d in
        steps of 2 (as mentioned earlier, for the sake of maintaining the even/odd values between
        the step and the k values).
      </div>
      <div>
        Our aim with the d and k position is to determine the best move we can do from the previous
        position. The best move is the one with the highest k, which means it maximizes x instead of
        y, since Myers' algorithm prioritizes deletion as opposed to insertion.
      </div>
      <div>
        To discover the best move we need to decide if we should move downwards from (d - 1, k + 1)
        (as k decreases by one when going down) or rightward from (d - 1, k - 1) (as k increases by
        one when going right).
      </div>
      <div>
        If k = -d, and we want to reach (d, -d) from (d - 1, k + 1) then the move must be downwards.
        (d - 1, -d + 1 -1 (from going downwards),{" "}
        <b>for d - 1, -d + 1 + 1 (from going rightward) we'd get an illegal</b>).
      </div>
      <div>
        <b>
          If we tried move rightward with k = -d, we would have to be at (d - 1, k - 1) which would
          mean we are currently at (d - 1, -d - 1) which isn't possible, as -d is the possible
          current step limit.
        </b>
      </div>
      <div>
        If k = +d, and we want to reach (d, d) from (d - 1, k - 1) then the move must be rightward
        (d - 1, d - 1 + 1 (from going rightward)).
      </div>
      <div>
        <b>
          If we tried move rightward with k = +d, we would have to be at (d - 1, k + 1) which would
          mean we are currently at (d - 1, d + 1) which isn't possible, as +d is the possible
          current step limit.
        </b>
      </div>
      <div>
        For all other values of k we pick the position with the highest x from the two adjacent k
        values in the previous step,{" "}
        <b>because we prioritize deleting over inserting in Myers' algorithm</b>, and check where
        said move will reach.
      </div>
      <StyledSubTitle>For example:</StyledSubTitle>
      <div>
        Let's say we consider the move (d, k) = (2, 0). We can either move rightward from (d, k) =
        (1, -1) where (x, y) = (1, 2) or downward from (d, k) = (1, 1) where (x, y) = (2, 1)
      </div>
      <MyersStepVisualizer
        trace={[
          { from: { x: 0, y: 0 }, to: { x: 2, y: 1 }, step: 0 },
          { from: { x: 0, y: 0 }, to: { x: 1, y: 2 }, step: 0 },
          { from: { x: 2, y: 1 }, to: { x: 2, y: 2 }, step: 1 },
        ]}
      />
      <div>
        Since (2, 1) has a higher x value than (1, 2) we pick a move downward from (2, 1) to (2, 2).
        Therefore we record (x, y) = (2, 2) for (d, k) = (2, 0).
      </div>
      <div>
        That explains why we record the move via this path when (2, 0) is also reachable going
        rightward from (1, 2) - picking the previous position with the highest x value means we try
        to maximize the number of deletions we make before trying insertions.
      </div>
      <StyledSubTitle>Another example:</StyledSubTitle>
      <div>
        In some situations the two previous positions will have the same x value. For example, (d,
        k) = (3, -1) where we can move downward from (x, y) = (2, 2) or rightward from (x, y) = (2,
        4).{" "}
        <b>
          Moving rightward will increase x so we move from (2,4) to (3, 4) and then diagonally to
          (4, 5).
        </b>
        <MyersStepVisualizer
          trace={[
            { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, step: 0 },
            { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, step: 0 },
            { from: { x: 0, y: 1 }, to: { x: 2, y: 4 }, step: 1 },
            { from: { x: 2, y: 4 }, to: { x: 4, y: 5 }, step: 2 },
            { from: { x: 1, y: 0 }, to: { x: 3, y: 1 }, step: 1 },
            { from: { x: 1, y: 0 }, to: { x: 2, y: 2 }, step: 1 },
          ]}
        />
      </div>
      <StyledSubTitle>Additional simplifications</StyledSubTitle>
      <div>
        Since we are storing each (x, y) position indexed against k, and k = x - y, we don't need to
        store the y since it can be calculated from the values of k and x.
      </div>
      <div>
        We don't need to store the direction of the move taken at each step, we just store the best
        x value we can achieve at each point. The path will be derived after we've completed this
        process to find the smallest d that gets us to the bottom right position. Once we know where
        the final position shows up we can backtrack to find which single path out of the many will
        lead us there.
      </div>
      <div>
        The x values in the <b>d</b>th round depend only on those in the <b>(d-1)</b>th round,
        because each round modifies either the odd or even k positions, each round doesn't modify
        the values it depends on from the previous round, therefore the x values can be stored in a
        single flat array indexed by k.
      </div>
      <SyntaxHighlighter
        code={`  const fromLength = from.length;
  const toLength = to.length;
  const maximumAmountOfActions = fromLength + toLength; // Where from and to have no shared characters at all.
  const kValues: number[] = Array.from({ length: maximumAmountOfActions * 2 + 1 }); // Maximum k for both positie and negative k's, alongside 0 as the divider.

  for (let d = 0; d < maximumAmountOfActions; d++) {
    for (let k = -d; k <= d; k++) {
      let x;

      const moveRight = kValues[k - 1] ?? 0;
      const moveDown = kValues[k + 1] ?? 0;

      if (k === -d || (k !== d && moveRight < moveDown)) {
        // If moveDown's k is above moveRight, that means that by moving down we'll get to a flow with a higher x than the one when moving right.
        x = moveDown;
      } else {
        x = moveRight + 1;
      }

      let y = x - k;

      // Checkes for diagonals.
      while (x < fromLength && y < toLength && from[x] === to[y]) {
        x++;
        y++;
      }

      kValues[k] = x;

      if (x >= fromLength && y >= toLength) {
        return d;
      }
    }
  }`}
      />
    </>
  );
};
