import { HardwareRoot } from "./Root";
import { Bits } from "./Bits";
import { Bytes } from "./Bytes";
import { RouteredInnerSidebarContainer } from "../../styledComponents/InnerSidebarContainer/RouteredInnerSidebarContainer";

export const Hardware = () => {
  return (
    <RouteredInnerSidebarContainer
      items={[
        { label: "Root", value: "/hardware" },
        { label: "Bits", value: "/hardware/bits" },
        { label: "Bytes", value: "/hardware/bytes" },
      ]}
      paths={{
        "/": <HardwareRoot />,
        "/bits": <Bits />,
        "/bytes": <Bytes />,
      }}
    />
  );
};
