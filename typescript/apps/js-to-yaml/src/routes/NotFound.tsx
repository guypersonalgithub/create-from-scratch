import { usePath } from "@packages/router";
import { StyledButton } from "../customizedComponents";

export const NotFound = () => {
  const { moveTo } = usePath();

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <h1>404 Not found</h1>
      <StyledButton
        onClick={() => moveTo({ pathname: "/" })}
        style={{ width: "50px", justifySelf: "center" }}
      >
        Back
      </StyledButton>
    </div>
  );
};
