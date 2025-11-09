import type { Meta } from "@storybook/react";
import { type Anchor, ScrollspyAnchors, useRegisterAnchors } from "@packages/scrollspy-anchors";
import { dynatic } from "@packages/dynatic-css";

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
    const { anchors, registerRef } = useRegisterAnchors();

    return (
      <div>
        <div
          className={dynatic`
            display: flex;
          `}
        >
          <div
            className={dynatic`
              width: 100%;
            `}
          >
            <div
              className={dynatic`
                height: 100vh;
                background-color: darkred;
              `}
            >
              Test0
            </div>
            <div
              ref={(ref) => registerRef({ ref, content: "Test" })}
              className={dynatic`
                height: 100vh;
                background-color: red;
                margin: 0;  
              `}
            >
              Test
            </div>
            <div
              ref={(ref) => registerRef({ ref, content: "Test2" })}
              className={dynatic`
                height: 100vh;
                background-color: green;  
              `}
            >
              Test2
            </div>
            <div
              ref={(ref) => registerRef({ ref, content: "Test3" })}
              className={dynatic`
                height: 100vh;
                background-color: blue;  
              `}
            >
              Test3
            </div>
            <div
              className={dynatic`
                height: 100vh;
                background-color: purple;
              `}
            >
              Test4
            </div>
          </div>
          <div
            className={dynatic`
              position: sticky;
              top: 10;
              height: fit-content;
            `}
          >
            <ScrollspyAnchors anchors={anchors} />
          </div>
        </div>
      </div>
    );
  },
};
