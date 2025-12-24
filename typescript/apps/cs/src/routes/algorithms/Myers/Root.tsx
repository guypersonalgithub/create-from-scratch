import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";
import { MinorDiff } from "../../../styledComponents/MinorDiff";
import { myersConstants } from "./constants";

export const MyersRoot = () => {
  const { fromExample, toExample } = myersConstants;

  return (
    <div>
      <StyledMainTitle>Myers</StyledMainTitle>
      <StyledSubTitle>Or more specifically Myers diff algorithm</StyledSubTitle>
      <div>
        Is an algorithm that mathematically calculates the least amount of changes required to alter
        a string so that it would match another string.
      </div>
      <div>
        For instance, from <b>{fromExample}</b> to <b>{toExample}</b>.
      </div>
      <div>
        When speaking of diffs regularly, one could notice there is potentially a decent amount of
        variations that could lead from string A to string B.
      </div>
      <div>Whether that would be:</div>
      <MinorDiff
        diffs={[
          { type: "DELETED", value: "C" },
          { type: "DELETED", value: "B" },
          { type: "DELETED", value: "A" },
          { type: "DELETED", value: "D" },
          { type: "ADDED", value: "B" },
          { type: "ADDED", value: "C" },
          { type: "ADDED", value: "D" },
          { type: "ADDED", value: "A" },
        ]}
      />
      <div>Or:</div>
      <MinorDiff
        diffs={[
          { type: "ADDED", value: "B" },
          { type: "UNCHANGED", value: "C" },
          { type: "DELETED", value: "B" },
          { type: "DELETED", value: "A " },
          { type: "UNCHANGED", value: "D" },
          { type: "ADDED", value: "A" },
        ]}
      />
      <div>Or even:</div>
      <MinorDiff
        diffs={[
          { type: "DELETED", value: "C" },
          { type: "UNCHANGED", value: "B" },
          { type: "DELETED", value: "A" },
          { type: "ADDED", value: "C" },
          { type: "UNCHANGED", value: "D" },
          { type: "ADDED", value: "A" },
        ]}
      />
      <div>
        However, not everyone of them is as easy to tell what was actually changed. This example
        shows the difference between two simple strings, 4 characters each.
      </div>
      <div>It is possible to be required to calculate the diff of millions of characters.</div>
      <div>
        When looking at the 3 different examples above, we can tell very easily that the first one
        is far more verbose, it has much more insertions and deletions as opposed to the other two,
        who use the fact certain characters might remain on both versions, and try to build their
        solution around them in order to avoid unnecessary additional changes.
      </div>
      <div>
        However, both the last 2 examples show the same number of changes, while listing different
        changes between the strings.
      </div>
      <div>
        That's why a diff algorithm should not only find the least amount of changes, but also a
        consistent diff strategy.
      </div>
      <div>
        The strategy should ideally create coherent consistent diffs, so that it would highlight
        changes as blocks as opposed to separate lines (assuming more than one line was changed), so
        that it would be clearer what was changed without a constant mess of deletions and
        insertions.
      </div>
      <div>
        That's why ideally we should be aiming at calculating the minimum amount of changes from
        string A to string B, which is what the Myers algorithm excels at.
      </div>
    </div>
  );
};
