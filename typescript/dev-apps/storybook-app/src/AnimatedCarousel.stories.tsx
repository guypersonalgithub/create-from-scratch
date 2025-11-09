import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCarousel } from "@packages/carousel";
import { dynatic } from "@packages/dynatic-css";

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
      <div
        className={dynatic`
          background-color: blue;
        `}
      >
        1
      </div>,
      <div
        className={dynatic`
          background-color: red;
        `}
      >
        2
      </div>,
      <div
        className={dynatic`
          background-color: green;
        `}
      >
        3
      </div>,
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
      <div
        className={dynatic`
          background-color: blue;
        `}
      >
        1
      </div>,
      <div
        className={dynatic`
          background-color: red;
        `}
      >
        2
      </div>,
      <div
        className={dynatic`
          background-color: green;
        `}
      >
        3
      </div>,
    ],
  },
  render: (args) => {
    return <AnimatedCarousel {...args} />;
  },
};
