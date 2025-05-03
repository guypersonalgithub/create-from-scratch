import { StyledCard, StyledCommandBox } from "../../styledComponents";
import { StyledTitle } from "../../styledComponents/StyledTitle";

export const QuickStart = () => {
  return (
    <div>
      <StyledCard>
        <StyledTitle>Quick Start</StyledTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            Make sure you have an up to date version of Node.js installed, and then run the
            following command:
          </div>
          <StyledCommandBox
            // style={{ flex: 1, minWidth: "230px" }}
            command="npm install -D js-to-yaml"
            copyToClipboard
            withIcons
          />
          <div>
            Regularly, it would be suggested to install the package as a dev dependency, unless you
            have a production usage for YAML convertions.
          </div>
          <div>
            Once installed, the function is ready to use, just import the desired functions wherever
            necessary, not further setup is needed.
          </div>
        </div>
      </StyledCard>
    </div>
  );
};
