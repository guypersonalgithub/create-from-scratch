import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs } from "@packages/breadcrumbs";

const meta = {
  title: "Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    crumbs: [
      { value: "Test", content: "Test" },
      { value: "Test1", content: "Test1" },
      { value: "Test2", content: "Test2" },
    ],
    onClick: ({ crumb }) => console.log(crumb),
  },
  render: (args) => {
    return <Breadcrumbs {...args} />;
  },
};
