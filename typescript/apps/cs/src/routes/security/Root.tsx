import { StyledLink } from "../../styledComponents/StyledLink";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

export const SecurityRoot = () => {
  return (
    <div>
      <StyledMainTitle>Security</StyledMainTitle>
      <StyledLink pathname="/security/attacks">Attacks</StyledLink>
    </div>
  );
};
