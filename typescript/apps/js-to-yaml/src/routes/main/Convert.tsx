import { usePath } from "@packages/router";
import { InputOutput, StyledButton, StyledCard } from "../../customizedComponents";
import { dynatic } from "../../dynatic-css.config";

export const Convert = () => {
  const { moveTo } = usePath();

  return (
    <div
      className={dynatic`
        display: flex;
        gap: 20px;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        padding: 1rem;
        min-height: 100vh;
        flex-direction: row;

        ${(config) => config.utils.widthMediaQuery({ to: "1300px" })} {
          flex-direction: column;
        }
      `}
    >
      <div
        className={dynatic`
          text-align: left;
          max-width: 500px;
        `}
      >
        <div
          className={dynatic`
            font-size: 50px;
            font-weight: bold;
          `}
        >
          Convert JavaScript to YAML with Ease
        </div>
        <div
          className={dynatic`
            font-size: 20px;
            color: ${(config) => config.colors.thirdColor};
          `}
        >
          Transform your JavaScript objects into clean, readable YAML in seconds. Perfect for
          configuration files, data storage, and more.
        </div>
        <div
          className={dynatic`
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-direction: row;

            ${(config) => config.utils.widthMediaQuery({ to: "400px" })} {
              flex-direction: column;
            }
          `}
        >
          <StyledButton
            className={dynatic`
              flex-shrink: 0;
            `}
            onClick={() => moveTo({ pathname: "/examples" })}
            addArrow
            variant="green"
          >
            Check some Examples
          </StyledButton>
          <StyledButton
            className={dynatic`
              flex-shrink: 0;
            `}
            onClick={() => moveTo({ pathname: "/documentation" })}
            variant="ghost"
          >
            View Documentation
          </StyledButton>
        </div>
      </div>
      <StyledCard
        className={dynatic`
          border: 1px solid ${(config) => config.colors.defaultBorder};
          width: 40vw;

          ${(config) => config.utils.widthMediaQuery({ to: "1300px" })} {
            width: 95%;
          }
        `}
      >
        <InputOutput
          code={{
            app: {
              name: "MyApp",
            },
            server: {
              port: 3000,
              host: "localhost",
              cors: {
                methods: ["GET", "POST"],
              },
            },
          }}
          language="typescript"
        />
      </StyledCard>
    </div>
  );
};
