import { usePath } from "@packages/router";
import { InputOutput, StyledButton, StyledCard } from "../../customizedComponents";
import { useBreakpoints } from "../../breakpoints";
import { dynatic } from "../../dynatic-css.config";

type ConvertProps = {
  isDesktop: boolean;
};

export const Convert = ({ isDesktop }: ConvertProps) => {
  const { moveTo } = usePath();
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({ updateOn: ["tablet", "mobile"] });
  const isMobile = breakpoint === "mobile";

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
      `}
      style={{
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      <div
        style={{
          textAlign: "left",
          maxWidth: "500px",
        }}
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
          `}
          style={{
            color: "var(--theme-thirdColor)",
          }}
        >
          Transform your JavaScript objects into clean, readable YAML in seconds. Perfect for
          configuration files, data storage, and more.
        </div>
        <div
          className={dynatic`
            display: flex;
            gap: 10px;
            margin-top: 20px;
          `}
          style={{
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <StyledButton
            style={{ flexShrink: 0 }}
            onClick={() => moveTo({ pathname: "/examples" })}
            addArrow
            variant="green"
          >
            Check some Examples
          </StyledButton>
          <StyledButton
            style={{ flexShrink: 0 }}
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
        `}
        style={{
          ...(isDesktop ? { width: "40vw" } : { width: "95%" }),
        }}
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
