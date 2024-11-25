import type { Meta, StoryObj } from "@storybook/react";
import { MathML } from "./MathML";

const meta = {
  title: "MathML",
  component: MathML,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MathML>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTMLFormatExample: Story = {
  args: {
    input:
      "12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3",
    format: "HTML",
  },
  render: (args) => {
    return <MathML {...args} />;
  },
};

export const JSXFormatExample: Story = {
  args: {
    input:
      "12 + (5 + 3 * 2) ^ 4 + (1 * 2 + 3 ^ (5sqrt(4)) + 7sin4) / (a + b (1 / 2 + 3) * 6) * 5 + 4 * 2 - sqrt(5 - 2 + ab) - 3",
    format: "JSX",
  },
  render: (args) => {
    return <MathML {...args} />;
  },
};
