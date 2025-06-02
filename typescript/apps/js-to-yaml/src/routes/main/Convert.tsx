import { usePath } from "@packages/router";
import { InputOutput, StyledButton, StyledCard } from "../../styledComponents";
import { useBreakpoints } from "../../breakpoints";

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
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          textAlign: "left",
          maxWidth: "500px",
        }}
      >
        <div style={{ fontSize: "50px", fontWeight: "bold" }}>
          Convert JavaScript to YAML with Ease
        </div>
        <div
          style={{
            color: "var(--theme-thirdColor)",
            fontSize: "20px",
          }}
        >
          Transform your JavaScript objects into clean, readable YAML in seconds. Perfect for
          configuration files, data storage, and more.
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
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
        style={{
          border: "1px solid var(--theme-border)",
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
