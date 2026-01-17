import { MyersRoot } from "./Root";
import { MyersAlgorithmTheory } from "./MyersAlgorithmTheory";
import { MyersAlgorithm } from "./MyersAlgorithm/MyersAlgorithm";
import { Backtracking } from "./Backtracking/Backtracking";
import { RouteredInnerSidebarContainer } from "../../../styledComponents/InnerSidebarContainer/RouteredInnerSidebarContainer";
import { MyersTheoryExampleWalkthrough } from "./MyersTheoryExampleWalkthrough";
import { CalculatingChanges } from "./CalculatingChanges";
import { MyersAlgorithmExamples } from "./MyersAlgorithmExamples/MyersAlgorithmExamples";
import { LinearSpaceAlgorithm } from "./LinearSpaceAlgorithm";
import { AlgorithmicComparison } from "./AlgorithmicComparison";

export const Myers = () => {
  return (
    <RouteredInnerSidebarContainer
      items={[
        { label: "Myers Algorithm", value: "/algorithms/myers" },
        { label: "Algorithm Theory", value: "/algorithms/myers/algorithm-theory" },
        {
          label: "Theory Example Walkthrough",
          value: "/algorithms/myers/theory-example-walkthrough",
        },
        { label: "Calculating Changes", value: "/algorithms/myers/calculating-changes" },
        { label: "Algorithm", value: "/algorithms/myers/algorithm" },
        { label: "Algorithm Examples", value: "/algorithms/myers/algorithm/examples" },
        { label: "Backtracking", value: "/algorithms/myers/backtracking" },
        { label: "Linear Space Algorithm", value: "/algorithms/myers/linear-space-algorithm" },
        { label: "Algorithmic Comparison", value: "/algorithms/myers/algorithmic-comparison" },
      ]}
      paths={{
        "/": <MyersRoot />,
        "/algorithm-theory": <MyersAlgorithmTheory />,
        "/theory-example-walkthrough": <MyersTheoryExampleWalkthrough />,
        "/calculating-changes": <CalculatingChanges />,
        "/algorithm": <MyersAlgorithm />,
        "/algorithm/examples": <MyersAlgorithmExamples />,
        "/backtracking": <Backtracking />,
        "/linear-space-algorithm": <LinearSpaceAlgorithm />,
        "/algorithmic-comparison": <AlgorithmicComparison />,
      }}
    />
  );
};
