import type { Meta, StoryObj } from "@storybook/react";
import { InteractiveVisibilityTitle } from "@packages/title";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "InteractiveVisibilityTitle",
  component: InteractiveVisibilityTitle,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof InteractiveVisibilityTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "Title",
    underlineClassName: dynatic`
        height: 2px;
        margin-top: 4px;
        background: #ff1e1e;
    `,
  },
  render: (args) => {
    return (
      <div>
        <div
          className={dynatic`
            height: 100vh;
          `}
        ></div>
        <InteractiveVisibilityTitle {...args} />
      </div>
    );
  },
};
