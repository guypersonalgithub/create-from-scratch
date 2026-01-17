import { dynatic } from "../../dynatic-css.config";
import { StyledLink } from "../../styledComponents/StyledLink";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

export const AlgorithmsRoot = () => {
  return (
    <div>
      <StyledMainTitle>Algorithms</StyledMainTitle>
      <div
        className={dynatic`
          display: flex;
          gap: 6px;
      `}
      >
        <StyledLink pathname="/algorithms/myers">Myers</StyledLink>
        <StyledLink pathname="/algorithms/divide-and-conquer">Divide and Conquer</StyledLink>
      </div>
    </div>
  );
};
