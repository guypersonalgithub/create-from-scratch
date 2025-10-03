import { AnimationContainerWrapper } from "@packages/animation-container";
import { StyledCard, StyledSyntaxHighlighter } from "../../styledComponents";
import { Fragment, useEffect, useRef, useState } from "react";
import { observeElementVisibility } from "@packages/element-utils";
import { useBreakpoints } from "../../breakpoints";
import { TypescriptTokenTypes } from "@packages/parse-typescript";

export const MainAd = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(1);
  const timeout = useRef<NodeJS.Timeout>(null);
  const [disableLifecycleAnimation, setDisableLifecycleAnimation] = useState(false);
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({ updateOn: ["desktop", "tablet"] });
  const isDesktop = breakpoint === "desktop";

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = observeElementVisibility({
      element: ref.current,
      observerCallback: ({ isIntersection }) => {
        setDisableLifecycleAnimation(!isIntersection);

        if (!isIntersection) {
          if (timeout.current) {
            clearTimeout(timeout.current);
          }
        } else {
          if (!disableLifecycleAnimation) {
            return;
          }

          if (timeout.current) {
            clearTimeout(timeout.current);
          }

          timeout.current = setTimeout(() => {
            setStage((prev) => {
              if (prev === 4) {
                return 1;
              }

              return prev + 1;
            });
          }, delay);
        }
      },
    });

    return () => {
      observer.disconnect();
    };
  }, [disableLifecycleAnimation]);

  const getCurrentStage = () => {
    if (stage === 1) {
      return {
        element: (
          <div>
            <h1>Tired of manually editing your YAML files?</h1>
          </div>
        ),
        delay: 3000,
      };
    }

    if (stage === 2) {
      return {
        element: (
          <StyledCard style={{ marginBottom: 0, padding: 0 }}>
            <StyledSyntaxHighlighter
              style={{
                border: "1px solid var(--theme-border)",
              }}
              pacing={100}
              code={`name: Tests
on:
  pull_request:
    branches:
      - main
    types:
      - opened
      - synchronize
      - reopened
    paths:
      - src/
jobs:
  Tests:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./src
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm i
      - name: Run tests
        run: npm run test`}
              animatedWriting
              withCursor
              copyToClipboard={false}
            />
          </StyledCard>
        ),
        delay: 5000,
      };
    }

    if (stage === 3) {
      return {
        element: (
          <div>
            <h1>Use JS to YAML to automate your YAML files creation and maintenance.</h1>
          </div>
        ),
        delay: 3000,
      };
    }

    return {
      element: (
        <StyledCard style={{ marginBottom: 0, padding: "2px" }}>
          <StyledSyntaxHighlighter
            code={`import { convertObjectToYaml } from "js-to-yaml";
import { writeFileSync } from "fs";

const testsConfig = {
  name: "Tests",
  on: {
    pull_request: {
    branches: ["main"],
    types: ["opened", "synchronize", "reopened"],
    },
  },
  jobs: {
    "Tests": {
      "runs-on": "ubuntu-latest",
      steps: [
        {
          name: "Install dependencies",
          run: "npm i",
        },
        {
          name: "Run tests",
          run: "npm run test",
        },
      ],
    },
  },
}

const output = convertObjectToYaml({ obj: testsConfig });
writeFileSync("./tests.yaml", output);
`}
            highlightCode
            copyToClipboard={false}
            customizeColors={() => {
              return {
                cellTypeRebranding: {
                  4: TypescriptTokenTypes.FUNCTION_NAME,
                  17: TypescriptTokenTypes.FUNCTION_NAME,
                },
              };
            }}
          />
        </StyledCard>
      ),
      delay: 5000,
    };
  };

  const { element, delay } = getCurrentStage();

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: isDesktop ? "500px" : "90vw",
        overflow: "hidden",
        textAlign: "left",
        height: "770px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <AnimationContainerWrapper
        changeMethod="fullPhase"
        style={{ width: "100%", transform: "translateX(-100%)" }}
        onMount={[
          { opacity: 0, transform: "translateX(-100%)" },
          { opacity: 1, transform: "translateX(0%)" },
        ]}
        onUnmount={[
          { opacity: 1, transform: "translateX(0%)" },
          { opacity: 0, transform: "translateX(100%)" },
        ]}
        onMountAnimationEnd={() => {
          if (disableLifecycleAnimation) {
            return;
          }

          if (timeout.current) {
            clearTimeout(timeout.current);
          }

          timeout.current = setTimeout(() => {
            setStage((prev) => {
              if (prev === 4) {
                return 1;
              }

              return prev + 1;
            });
          }, delay);
        }}
        disableMountAnimationOnInit={false}
      >
        <Fragment key={stage}>{element}</Fragment>
      </AnimationContainerWrapper>
    </div>
  );
};
