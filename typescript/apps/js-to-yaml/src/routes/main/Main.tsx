import { StyledButton, StyledCard, StyledCommandBox } from "../../styledComponents";
import { Alert } from "@packages/alert";
import { Javascript, OpenBook, Terminal, YAML } from "@packages/icons";
import { useGetBreakpoint } from "../../breakpoints";
import { usePath } from "@packages/router";
import { StyledList } from "../../styledComponents/StyledList";
import { SyntaxHighlighter } from "@packages/syntax-highlighter";
import { MainLogo } from "../../styledComponents";
import { MainAd } from "./MainAd";
import { TypescriptTokenTypes } from "@packages/parse-typescript";
import { getCurrentYear } from "@packages/date";

export const Main = () => {
  const { moveTo } = usePath();
  const { breakpoint } = useGetBreakpoint();
  const isDesktop = breakpoint === "desktop";

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
            minHeight: "650px",
            marginBottom: "20px",
          }}
        >
          <div style={{ marginLeft: "20px", width: "300px" }}>
            <MainLogo />
            <div style={{ fontSize: "50px", fontWeight: "bolder" }}>JS to YAML</div>
          </div>
          <MainAd />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <StyledCard style={{ ...(isDesktop ? { width: "50vw" } : {}), margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Terminal
                style={{
                  width: "24px",
                  height: "24px",
                  color: "rgba(0, 119, 184, 0.976)",
                  marginTop: "4px",
                }}
              />
              <span style={{ fontWeight: "bold", fontSize: "25px" }}>Get Started</span>
            </div>
            <div style={{ textAlign: "left" }}>
              Install JS-to-YAML in your project with the following command:
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <StyledCommandBox
                style={{ flex: 1, minWidth: "230px" }}
                command="npm install -D js-to-yaml"
                copyToClipboard
                withIcons
              />
              <StyledButton
                style={{ whiteSpace: "nowrap", width: "220px", flexShrink: 0 }}
                onClick={() => moveTo({ pathname: "/documentation" })}
              >
                Read docs
              </StyledButton>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Alert
                type="info"
                message="Once installed, you can easily convert javascript objects to yaml and vice versa."
              />
            </div>
          </StyledCard>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <StyledCard style={{ ...(isDesktop ? { width: "50vw" } : {}) }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <OpenBook
                style={{
                  width: "24px",
                  height: "24px",
                  color: "rgba(0, 119, 184, 0.976)",
                  marginTop: "6px",
                }}
              />
              <span style={{ fontWeight: "bold", fontSize: "25px" }}>Core features</span>
            </div>
            <StyledList
              list={[
                {
                  icon: (
                    <YAML
                      width={30}
                      style={{
                        color: "var(--theme-color)",
                        transition: "var(--theme-transition)",
                      }}
                    />
                  ),
                  title: "Convert Javascript objects to YAML formatted strings",
                  subTitle:
                    "Pass a Javascript object as an argument and receive a formatted YAML string, ready to be saved as a file",
                  example: (
                    <SyntaxHighlighter
                      code={`import { convertObjectToYaml } from "js-to-yaml";

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
`}
                      highlightCode
                      customizeColors={() => {
                        return {
                          cellTypeRebranding: {
                            4: TypescriptTokenTypes.FUNCTION_NAME,
                          },
                        };
                      }}
                    />
                  ),
                },
                {
                  icon: (
                    <Javascript
                      width={30}
                      style={{
                        color: "var(--theme-color)",
                        transition: "var(--theme-transition)",
                      }}
                      fill="currentColor"
                    />
                  ),
                  title: "Convert YAML strings to a Javascript Object",
                  subTitle: "Pass a YAML string as an argument and receive a Javascript Object",
                  example: (
                    <SyntaxHighlighter
                      code={`import { convertYamlToObject } from "js-to-yaml";
import { readFileSync } from "fs";

const yaml = readFileSync("./file.yaml"); // Assuming file.yaml is a real YAML file
const output = convertYamlToObject({ str: yaml });
`}
                      highlightCode
                      customizeColors={() => {
                        return {
                          cellTypeRebranding: {
                            4: TypescriptTokenTypes.FUNCTION_NAME,
                            17: TypescriptTokenTypes.FUNCTION_NAME,
                          },
                        };
                      }}
                    />
                  ),
                },
              ]}
            />
          </StyledCard>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Footer />
      </div>
    </div>
  );
};

const Footer = () => {
  const currentYear = getCurrentYear();
  const { breakpoint } = useGetBreakpoint();
  const isDesktop = breakpoint === "desktop";

  return (
    <StyledCard style={{ ...(isDesktop ? { width: "80vw" } : {}), margin: "0 auto" }}>
      All rights reserved © {currentYear}
    </StyledCard>
  );
};
