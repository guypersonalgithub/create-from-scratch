import { usePath } from "@packages/router";
import { StyledButton } from "../customizedComponents";
import { dynatic } from "../dynatic-css.config";

export const NotFound = () => {
  const { moveTo } = usePath();

  return (
    <div
      className={dynatic`
        display: grid;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      `}
    >
      <h1>404 Not found</h1>
      <StyledButton
        className={dynatic`
          width: 50px;
          justify-self: center;
        `}
        onClick={() => moveTo({ pathname: "/" })}
      >
        Back
      </StyledButton>
    </div>
  );
};
