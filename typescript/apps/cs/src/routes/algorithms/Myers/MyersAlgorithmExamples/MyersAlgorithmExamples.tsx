import { StyledInteractiveTitle } from "../../../../styledComponents/StyledInteractiveTitle";
import { FirstExample } from "./FirstExample";
import { SecondExample } from "./SecondExample";

export const MyersAlgorithmExamples = () => {
  return (
    <div>
      <StyledInteractiveTitle>Algorithm examples</StyledInteractiveTitle>
      <ul>
        <li>
          <FirstExample />
        </li>
        <li>
          <SecondExample />
        </li>
      </ul>
    </div>
  );
};
