import { SubRouter } from "@packages/router";
import { DocumentationMain } from "./DocumentationMain";
import { DocumentationSidebar } from "../../components/DocumentationSidebar";
import { QuickStart } from "./QuickStart";
import { RightSidebar } from "./RightSidebar";
import { ConvertToYaml } from "./ConvertToYaml";
import { ConvertToJavascript } from "./ConvertToJavascript";
import { useBreakpoints } from "../../breakpoints";
import { dynatic } from "../../dynatic-css.config";

export const Documentation = () => {
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({
    updateOn: ["mediumDesktop"],
    includeMismatchBelow: true,
    defaultAboveBreakpoint: "mediumDesktop",
  });
  const isDesktop = breakpoint === "mediumDesktop";
  const sidebarClassName = dynatic`
    background-color: ${(config) => config.colors.secondaryBG};
    color: ${(config) => config.colors.mainColor};
    transition: ${(config) => config.shared.defaultTransition};
    position: sticky;
    top: 61px;
    font-size: 14px;
    height: calc(100vh - 81px);
  `;

  return (
    <div
      className={dynatic`
        display: flex;
        gap: 10px;
        min-height: calc(100vh - 61px);
        justify-content: space-between;
        align-items: flex-start;
      `}
    >
      {isDesktop ? <DocumentationSidebar className={sidebarClassName} /> : null}
      <SubRouter
        wrapperClassName={dynatic`
          flex: 1;
          min-width: 0;
          margin: 1rem;
        `}
        paths={{
          "/": <DocumentationMain />,
          "/quickstart": <QuickStart />,
          "/converttoyaml": <ConvertToYaml />,
          "/converttojavascript": <ConvertToJavascript />,
        }}
      />
      {isDesktop ? <RightSidebar className={sidebarClassName} /> : null}
    </div>
  );
};
