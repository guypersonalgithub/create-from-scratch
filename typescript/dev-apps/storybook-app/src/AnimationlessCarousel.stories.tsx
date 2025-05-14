import type { Meta, StoryObj } from "@storybook/react";
import { AnimationlessCarousel } from "@packages/carousel";

const meta = {
  title: "AnimationlessCarousel",
  component: AnimationlessCarousel,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AnimationlessCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    style: { height: "300px", width: "300px" },
    items: [1, 2, 3],
    automaticTransition: true,
  },
  render: (args) => {
    return <AnimationlessCarousel {...args} />;
  },
};

export const TransitionLess: Story = {
  args: {
    style: { height: "300px", width: "300px" },
    items: [1, 2, 3],
  },
  render: (args) => {
    return <AnimationlessCarousel {...args} />;
  },
};
