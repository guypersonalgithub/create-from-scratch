import type { Meta } from "@storybook/react";
import { MyersStepVisualizer } from "@packages/myers-visualizer";

const meta = {
  title: "MyersStepVisualizer",
  component: MyersStepVisualizer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MyersStepVisualizer>;

export default meta;

const traces = [
  { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, step: 0 },
  { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, step: 0 },

  { from: { x: 1, y: 0 }, to: { x: 3, y: 1 }, step: 1 },
  { from: { x: 1, y: 0 }, to: { x: 2, y: 2 }, step: 1 },
  { from: { x: 0, y: 1 }, to: { x: 2, y: 4 }, step: 1 },

  { from: { x: 3, y: 1 }, to: { x: 5, y: 2 }, step: 2 },
  { from: { x: 3, y: 1 }, to: { x: 5, y: 4 }, step: 2 },
  { from: { x: 2, y: 4 }, to: { x: 4, y: 5 }, step: 2 },
  { from: { x: 2, y: 4 }, to: { x: 3, y: 6 }, step: 2 },

  { from: { x: 5, y: 2 }, to: { x: 7, y: 3 }, step: 3 },
  { from: { x: 5, y: 4 }, to: { x: 7, y: 5 }, step: 3 },
  { from: { x: 5, y: 4 }, to: { x: 5, y: 5 }, step: 3 },
  { from: { x: 4, y: 5 }, to: { x: 4, y: 6 }, step: 3 },

  { from: { x: 7, y: 5 }, to: { x: 7, y: 6 }, step: 4 },
  { from: { x: 5, y: 5 }, to: { x: 5, y: 6 }, step: 4 },
];

export const Primary = {
  render: () => {
    return <MyersStepVisualizer trace={traces} />;
  },
};

export const Mini = {
  render: () => {
    return <MyersStepVisualizer trace={traces} isSwitched />;
  },
};
