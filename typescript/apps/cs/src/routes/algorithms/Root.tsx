import { StyledLink } from "../../styledComponents/StyledLink";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

export const AlgorithmsRoot = () => {
  return (
    <div>
      <StyledMainTitle>Algorithms</StyledMainTitle>
      <StyledLink pathname="/algorithms/myers">Myers</StyledLink>
    </div>
  );
};
