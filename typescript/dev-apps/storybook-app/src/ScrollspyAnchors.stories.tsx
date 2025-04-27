import type { Meta } from "@storybook/react";
import { Anchor, ScrollspyAnchors, registerRef } from "@packages/scrollspy-anchors";
import { useRef } from "react";

const meta = {
  title: "ScrollspyAnchors",
  component: ScrollspyAnchors,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScrollspyAnchors>;

export default meta;

export const Primary = {
  render: () => {
    const refs = useRef<Anchor[]>([]);

    return (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "100%" }}>
            <div style={{ height: "100vh", backgroundColor: "darkred" }}>Test0</div>
            <div
              ref={(ref) => registerRef({ refs, ref, content: "Test" })}
              style={{ height: "100vh", backgroundColor: "red", margin: 0 }}
            >
              Test
            </div>
            <div
              ref={(ref) => registerRef({ refs, ref, content: "Test2" })}
              style={{ height: "100vh", backgroundColor: "green" }}
            >
              Test2
            </div>
            <div
              ref={(ref) => registerRef({ refs, ref, content: "Test3" })}
              style={{ height: "100vh", backgroundColor: "blue" }}
            >
              Test3
            </div>
            <div style={{ height: "100vh", backgroundColor: "purple" }}>Test4</div>
          </div>
          <div style={{ position: "sticky", top: 10, height: "fit-content" }}>
            <ScrollspyAnchors anchors={refs.current} />
          </div>
        </div>
      </div>
    );
  },
};
