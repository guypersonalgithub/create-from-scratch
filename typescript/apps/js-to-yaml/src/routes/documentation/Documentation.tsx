import { SubRouter } from "@packages/router";
import { DocumentationMain } from "./DocumentationMain";
import { DocumentationSidebar, LinkGroup } from "./DocumentationSidebar";
import { QuickStart } from "./QuickStart";
import { RightSidebar } from "./RightSidebar";
import { ConvertToYaml } from "./ConvertToYaml";
import { ConvertToJavascript } from "./ConvertToJavascript";

const links: LinkGroup[] = [
  {
    title: "Getting Started",
    links: [
      {
        label: "Introduction",
        pathname: "/documentation",
      },
      {
        label: "Quick Start",
        pathname: "/documentation/quickstart",
      },
    ],
  },
  {
    title: "YAML",
    links: [
      {
        label: "Convert to YAML",
        pathname: "/documentation/converttoyaml",
      },
    ],
  },
  {
    title: "Javascript",
    links: [
      {
        label: "Convert to Javascript",
        pathname: "/documentation/converttojavascript",
      },
    ],
  },
];

export const Documentation = () => {
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
      <DocumentationSidebar
        links={links}
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
      <SubRouter
        wrapperStyle={{ flex: 1, minWidth: 0, margin: "1rem" }}
        paths={{
          "/": <DocumentationMain />,
          "/quickstart": <QuickStart />,
          "/converttoyaml": <ConvertToYaml />,
          "/converttojavascript": <ConvertToJavascript />,
        }}
      />
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
    </div>
  );
};
