import { MyersCanvas } from "@packages/myers-visualizer";
import { StyledInteractiveTitle } from "../../../styledComponents/StyledInteractiveTitle";
import { myersConstants } from "./constants";

export const MyersTheoryExampleWalkthrough = () => {
  const { fromExample, toExample } = myersConstants;

  return (
    <>
      <StyledInteractiveTitle>Example walkthrough</StyledInteractiveTitle>
      <div>
        That means that for the previous examples of from <b>{fromExample}</b> to <b>{toExample}</b>
        , reaching (1 , 0) following the Myers' algorithm, would mean deleting C at the very start.
      </div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[{ from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, color: "red" }]}
      />
      <div>
        Once reaching that point, we can notice that not only we can go right or down once we reach
        (1 , 0), but also diagonally, which is ideal, as that doesn't require a change.
      </div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, color: "red" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 }, color: "blue" },
        ]}
      />
      <div>
        Diagonal movement refers to both "deleting and inserting" the same character, because it
        exists for both the old and new strings at the specific location we are currently at, for
        both of their current indexes.
      </div>
      <div>Following that, we can delete A to reach (3 , 1)</div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, color: "red" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 }, color: "blue" },
          { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, color: "red" },
        ]}
      />
      <div>
        Then add C which would lead us to (3 , 2). At that moment, we will be able to encounter a
        diagonal from (3 , 2) to (4 , 3).
      </div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, color: "red" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 }, color: "blue" },
          { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, color: "red" },
          { from: { x: 3, y: 1 }, to: { x: 3, y: 2 }, color: "green" },
          { from: { x: 3, y: 2 }, to: { x: 4, y: 3 }, color: "blue" },
        ]}
      />
      <div>
        And then finally, we can add A to reach (4 , 4) which is the final destination of the diff.
      </div>
      <MyersCanvas
        oldStr={fromExample}
        newStr={toExample}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, color: "red" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 }, color: "blue" },
          { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, color: "red" },
          { from: { x: 3, y: 1 }, to: { x: 3, y: 2 }, color: "green" },
          { from: { x: 3, y: 2 }, to: { x: 4, y: 3 }, color: "blue" },
          { from: { x: 4, y: 3 }, to: { x: 4, y: 4 }, color: "green" },
        ]}
      />
      <div>
        The maximum amount of changes we can take from the old string to the new string is the
        sum of their lengths (in the given example{" "}
        <b>
          {fromExample} ({fromExample.length})
        </b>{" "}
        and{" "}
        <b>
          {toExample} ({toExample.length})
        </b>
        , so in total <b>{fromExample.length + toExample.length}</b>), the Myers' algorithm prefers
        as many diagonal encounters as possible, as that potentially lowers the amount of changes
        required.
      </div>
    </>
  );
};
