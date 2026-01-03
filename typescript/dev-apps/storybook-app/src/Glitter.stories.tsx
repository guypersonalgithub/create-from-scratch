import type { Meta, StoryObj } from "@storybook/react";
import { Glitter } from "@packages/glitter";
import { ProgressBar } from "@packages/progress-bar";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "Glitter",
  component: Glitter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Glitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: (
      <ProgressBar
        className={dynatic`
          border: 1px solid black;
          border-radius: 10px;
          overflow: hidden;
        `}
        innerClassName={dynatic`
          background: linear-gradient(90deg, #e74c3c, #ff4c4c, #ff1a1a);
          height: 15px;
        `}
        progress={100}
      />
    ),
  },
  render: (args) => {
    return <Glitter {...args} />;
  },
};
