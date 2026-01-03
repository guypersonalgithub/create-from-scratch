import { SubRouter, usePath, usePathState } from "@packages/router";
import { HardwareRoot } from "./Root";
import { InnerSidebarContainer } from "../../styledComponents/InnerSidebarContainer/InnerSidebarContainer";
import { dynatic } from "../../dynatic-css.config";
import { Bits } from "./Bits";
import { Bytes } from "./Bytes";

export const Hardware = () => {
  const { path } = usePathState();
  const { moveTo } = usePath();

  return (
    <InnerSidebarContainer
      className={dynatic`
        height: calc(100vh - 80px);
      `}
      sidebarClassName={dynatic`
        height: calc(100vh - 100px);  
      `}
      current={path}
      onClick={(pathname) => moveTo({ pathname })}
      items={[
        { label: "Root", value: "/hardware" },
        { label: "Bits", value: "/hardware/bits" },
        { label: "Bytes", value: "/hardware/bytes" },
      ]}
      content={
        <SubRouter
          wrapperClassName={dynatic`
            padding-inline: 20px;
            padding-bottom: 20px;
            overflow-y: auto;
            height: calc(100vh - 100px);
          `}
          paths={{
            "/": <HardwareRoot />,
            "/bits": <Bits />,
            "/bytes": <Bytes />,
          }}
        />
      }
    />
  );
};
