import { MinorDiff } from "../../../styledComponents/MinorDiff";
import { myersConstants } from "./constants";
import { StyledSkewedTitle } from "../../../styledComponents/StyledSkewedTitle";

export const MyersRoot = () => {
  const { fromExample, toExample } = myersConstants;

  return (
    <>
      <StyledSkewedTitle title="Myers" skewed="Algorithm" />
      <div>
        An algorithm that mathematically calculates the least amount of changes required to alter a
        string so that it would match another string.
      </div>
      <div>
        For instance, reaching from <b>{fromExample}</b> to <b>{toExample}</b>.
      </div>
      <div>In general, there are many ways to reach from string A to string B.</div>
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
        All of them are reaching the same end goal, but the process of moving from A to B is
        different. Not only that, if we would like to know what was actually changed during the
        process, some of the ways to do so, lead to a very subpar way of displaying said changes.
      </div>
      <div>
        While the current example is a just a diff between 4 characters, when speaking of
        algorithms, they should also be able to support millions of changes, and make it easier to
        understand what was actually changed during the process.
      </div>
      <div>
        When looking at the 3 different examples above, it is very simple to notice that the first
        example is far more verbose. It has much more insertions and deletions as opposed to the
        other two, who use the fact certain characters might remain on both versions, and try to
        build their solution around them in order to minimize the amount of changes required.
      </div>
      <div>
        However, even if both last examples require the same number of changes, the order of said
        changes and the actual changes required are different between them.
      </div>
      <div>
        That's why, in order to meaningfully figure out what was changed consistently across
        multiple usecases, a diff algorithm should not only find the least amount of changes, but
        also should have a consistent diff strategy.
      </div>
      <div>
        <b>
          The strategy should ideally create coherent consistent diffs, so that it would highlight
          changes as blocks as opposed to separate separated lines, as that makes alot of potential
          visual noise.
        </b>
      </div>
      <div>Myers algorithm exactly excels at that.</div>
    </>
  );
};
