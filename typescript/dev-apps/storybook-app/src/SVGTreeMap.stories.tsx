import type { Meta, StoryObj } from "@storybook/react";
import { SVGTreeMap } from "@packages/svg-treemap";

const meta = {
  title: "SVGTreeMap",
  component: SVGTreeMap,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SVGTreeMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: [
      { label: "A", value: 30 },
      { label: "B", value: 50 },
      { label: "C", value: 20 },
    ],
  },
  render: (args) => <SVGTreeMap {...args} />,
};
