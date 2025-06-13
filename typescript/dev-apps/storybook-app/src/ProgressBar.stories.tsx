import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "@packages/progress-bar";

const meta = {
  title: "ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    style: {
      border: "1px solid black",
      borderRadius: "10px",
    },
    innerStyle: {
      backgroundColor: "blue",
      height: "15px",
    },
    progress: 50,
  },
  render: (args) => {
    return <ProgressBar {...args} />;
  },
};
