import { SubRouter } from "@packages/router";
import { DocumentationMain } from "./DocumentationMain";
import { DocumentationSidebar } from "../../components/DocumentationSidebar";
import { QuickStart } from "./QuickStart";
import { RightSidebar } from "./RightSidebar";
import { ConvertToYaml } from "./ConvertToYaml";
import { ConvertToJavascript } from "./ConvertToJavascript";
import { useBreakpoints } from "../../breakpoints";

export const Documentation = () => {
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({
    updateOn: ["mediumDesktop"],
    includeMismatchBelow: true,
    defaultAboveBreakpoint: "mediumDesktop",
  });
  const isDesktop = breakpoint === "mediumDesktop";

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        minHeight: `calc(100vh - 61px)`,
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {isDesktop ? (
        <DocumentationSidebar
          style={{
            backgroundColor: "var(--theme-subBackground)",
            color: "var(--theme-color)",
            transition: "var(--theme-transition)",
            position: "sticky",
            top: "61px",
            fontSize: "14px",
            height: "calc(100vh - 81px)",
          }}
          linkStyle={{ fontWeight: "normal" }}
        />
      ) : null}
      <SubRouter
        wrapperStyle={{ flex: 1, minWidth: 0, margin: "1rem" }}
        paths={{
          "/": <DocumentationMain />,
          "/quickstart": <QuickStart />,
          "/converttoyaml": <ConvertToYaml />,
          "/converttojavascript": <ConvertToJavascript />,
        }}
      />
      {isDesktop ? (
        <RightSidebar
          style={{
            backgroundColor: "var(--theme-subBackground)",
            color: "var(--theme-color)",
            transition: "var(--theme-transition)",
            position: "sticky",
            top: "61px",
            fontSize: "14px",
            height: "calc(100vh - 81px)",
          }}
        />
      ) : null}
    </div>
  );
};
