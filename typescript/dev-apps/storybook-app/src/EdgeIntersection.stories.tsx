import type { Meta } from "@storybook/react";
import { EdgeIntersection, EdgeWrapperRefs } from "@packages/edge-intersection";
import { createRef } from "react";

const meta = {
  title: "EdgeIntersection",
  component: EdgeIntersection,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EdgeIntersection>;

export default meta;

export const Primary = {
  render: () => {
    const intersectionRefs: EdgeWrapperRefs = {
      top: createRef(),
      topLeft: createRef(),
      topRight: createRef(),
      left: createRef(),
      bottom: createRef(),
      bottomLeft: createRef(),
      bottomRight: createRef(),
      right: createRef(),
      customTop: createRef(),
      customTopLeft: createRef(),
      customTopRight: createRef(),
      customLeft: createRef(),
      customBottom: createRef(),
      customBottomLeft: createRef(),
      customBottomRight: createRef(),
      customRight: createRef(),
    };

    return (
      <EdgeIntersection
        id={"test"}
        intersectionRefs={intersectionRefs}
        edgeIntersectionStyle={{ border: "1px solid blue" }}
      >
        <div>Test</div>
      </EdgeIntersection>
    );
  },
};
