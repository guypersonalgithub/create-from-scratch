import { StyledLink } from "../../../styledComponents/StyledLink";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";

export const AttacksRoot = () => {
  return (
    <div>
      <StyledMainTitle>Attacks</StyledMainTitle>
      <StyledLink pathname="/security/attacks/fork-bomb">Fork Bomb attack</StyledLink>
    </div>
  );
};
