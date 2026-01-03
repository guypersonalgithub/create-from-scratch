import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "@packages/progress-bar";
import { dynatic } from "@packages/dynatic-css";

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
    className: dynatic`
      border: 1px solid black;
      border-radius: 10px;
      overflow: hidden;
    `,
    innerClassName: dynatic`
      background-color: blue;
      height: 15px;
    `,
    progress: 50,
  },
  render: (args) => {
    return <ProgressBar {...args} />;
  },
};

export const InitiallyAnimated: Story = {
  args: {
    className: dynatic`
      border: 1px solid black;
      border-radius: 10px;
      overflow: hidden;
    `,
    innerClassName: dynatic`
      background-color: blue;
      height: 15px;
    `,
    progress: 50,
    initiallyAnimated: true,
  },
  render: (args) => {
    return <ProgressBar {...args} />;
  },
};
