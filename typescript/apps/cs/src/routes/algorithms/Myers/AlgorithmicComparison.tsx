import { MathML } from "@packages/mathml";
import { StyledComparisonTable } from "../../../styledComponents/StyledComparisonTable";
import { dynatic } from "../../../dynatic-css.config";
import { SimpleCheck, SimpleCross } from "@packages/icons";
import { StyledInteractiveTitle } from "../../../styledComponents/StyledInteractiveTitle";

export const AlgorithmicComparison = () => {
  const timeComplexity = <MathML input="O((N+M)*D)" />;

  return (
    <div>
      <StyledInteractiveTitle>Algorithmic Comparison</StyledInteractiveTitle>
      <StyledComparisonTable
        columns={[
          {
            header: "Aspect",
            cell: (row) => {
              return <div>{row.aspect}</div>;
            },
            size: 200,
          },
          {
            header: "Classic",
            cell: (row) => {
              return <div>{row.classic}</div>;
            },
            size: 250,
          },
          {
            header: "Linear-space",
            cell: (row) => {
              return <div>{row.linearSpace}</div>;
            },
            size: 200,
          },
        ]}
        data={[
          {
            aspect: "Time complexity",
            classic: timeComplexity,
            linearSpace: timeComplexity,
          },
          {
            aspect: "Space complexity",
            classic: (
              <div
                className={dynatic`
                display: flex;
                gap: 6px;
              `}
              >
                <MathML input="O(N*M)" />
                <div>or</div>
                <MathML input="O(D^2)" />
              </div>
            ),
            linearSpace: <MathML input="O(N+M)" />,
          },
          {
            aspect: "Stores full trace",
            classic: <SimpleCheck size={24} />,
            linearSpace: <SimpleCross size={18} />,
          },
          {
            aspect: "Is recursive",
            classic: <SimpleCross size={18} />,
            linearSpace: (
              <div
                className={dynatic`
                display: flex;
                gap: 6px;  
              `}
              >
                <SimpleCheck size={24} />
                (divide & conquer)
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
