import { RouteredInnerSidebarContainer } from "../../styledComponents/InnerSidebarContainer/RouteredInnerSidebarContainer";
import { EventLoop } from "./EventLoop";
import { JavascriptRoot } from "./Root";

export const Javascript = () => {
  return (
    <RouteredInnerSidebarContainer
      items={[
        { label: "Javascript", value: "/javascript" },
        { label: "Event Loop", value: "/javascript/event-loop" },
      ]}
      paths={{
        "/": <JavascriptRoot />,
        "/event-loop": <EventLoop />,
      }}
    />
  );
};
