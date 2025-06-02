import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCarousel } from "@packages/carousel";

const meta = {
  title: "AnimatedCarousel",
  component: AnimatedCarousel,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AnimatedCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    style: { height: "300px", width: "300px" },
    items: [
      <div style={{ backgroundColor: "blue" }}>1</div>,
      <div style={{ backgroundColor: "red" }}>2</div>,
      <div style={{ backgroundColor: "green" }}>3</div>,
    ],
    automaticTransition: true,
  },
  render: (args) => {
    return <AnimatedCarousel {...args} />;
  },
};

export const TransitionLess: Story = {
  args: {
    style: { height: "300px", width: "300px" },
    items: [
      <div style={{ backgroundColor: "blue" }}>1</div>,
      <div style={{ backgroundColor: "red" }}>2</div>,
      <div style={{ backgroundColor: "green" }}>3</div>,
    ],
  },
  render: (args) => {
    return <AnimatedCarousel {...args} />;
  },
};
