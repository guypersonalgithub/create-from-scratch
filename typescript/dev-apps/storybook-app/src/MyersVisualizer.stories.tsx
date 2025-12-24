import type { Meta } from "@storybook/react";
import { MyersCanvas } from "@packages/myers-visualizer";

const meta = {
  title: "MyersCanvas",
  component: MyersCanvas,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MyersCanvas>;

export default meta;

export const Primary = {
  render: () => {
    return <MyersCanvas oldStr="abcd" newStr="abrd" />;
  },
};

export const WithHighlights = {
  render: () => {
    return (
      <MyersCanvas
        oldStr="ABCABBA"
        newStr="CBABAC"
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, label: "1", color: "blue" },
          { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, color: "blue" },
          { from: { x: 0, y: 1 }, to: { x: 0, y: 2 }, label: "2", color: "purple" },
          { from: { x: 0, y: 2 }, to: { x: 1, y: 3 }, color: "purple" },
          { from: { x: 1, y: 3 }, to: { x: 2, y: 4 }, color: "purple" },
          { from: { x: 0, y: 1 }, to: { x: 1, y: 1 }, color: "purple" },
          { from: { x: 1, y: 1 }, to: { x: 2, y: 2 }, color: "purple" },
          { from: { x: 1, y: 0 }, to: { x: 1, y: 1 }, label: "2", color: "purple" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 0 }, color: "purple" },
          { from: { x: 2, y: 0 }, to: { x: 3, y: 1 }, color: "purple" },
          { from: { x: 2, y: 4 }, to: { x: 2, y: 5 }, label: "3", color: "brown" },
          { from: { x: 2, y: 5 }, to: { x: 3, y: 6 }, color: "brown" },
          { from: { x: 2, y: 4 }, to: { x: 3, y: 4 }, color: "brown" },
          { from: { x: 3, y: 4 }, to: { x: 4, y: 5 }, color: "brown" },
          { from: { x: 2, y: 2 }, to: { x: 3, y: 2 }, label: "3", color: "brown" },
          { from: { x: 3, y: 2 }, to: { x: 4, y: 3 }, color: "brown" },
          { from: { x: 4, y: 3 }, to: { x: 5, y: 4 }, color: "brown" },
          { from: { x: 2, y: 2 }, to: { x: 2, y: 3 }, skipped: true },
          { from: { x: 3, y: 1 }, to: { x: 3, y: 2 }, label: "3", color: "brown" },
          { from: { x: 3, y: 1 }, to: { x: 4, y: 1 }, color: "brown" },
          { from: { x: 4, y: 1 }, to: { x: 5, y: 2 }, color: "brown" },
          { from: { x: 3, y: 6 }, to: { x: 4, y: 6 }, label: "4", color: "darkgreen" },
          { from: { x: 4, y: 5 }, to: { x: 4, y: 6 }, color: "darkgreen" },
          { from: { x: 4, y: 5 }, to: { x: 5, y: 5 }, label: "4", color: "darkgreen" },
          { from: { x: 5, y: 4 }, to: { x: 5, y: 5 }, label: "4", color: "darkgreen" },
          { from: { x: 5, y: 4 }, to: { x: 6, y: 4 }, label: "4", color: "darkgreen" },
          { from: { x: 6, y: 4 }, to: { x: 7, y: 5 }, color: "darkgreen" },
          { from: { x: 5, y: 2 }, to: { x: 5, y: 3 }, label: "4", color: "darkgreen" },
          { from: { x: 5, y: 3 }, to: { x: 6, y: 4 }, color: "darkgreen" },
          { from: { x: 5, y: 2 }, to: { x: 6, y: 2 }, label: "4", color: "darkgreen" },
          { from: { x: 6, y: 2 }, to: { x: 7, y: 3 }, color: "darkgreen" },
          { from: { x: 4, y: 6 }, to: { x: 5, y: 6 }, label: "5", color: "magenta" },
          { from: { x: 5, y: 5 }, to: { x: 5, y: 6 }, label: "5", color: "magenta" },
          { from: { x: 5, y: 5 }, to: { x: 6, y: 5 }, label: "5", color: "magenta" },
          { from: { x: 7, y: 5 }, to: { x: 7, y: 6 }, label: "5", color: "magenta" },
          { from: { x: 7, y: 3 }, to: { x: 7, y: 4 }, label: "5", color: "magenta" },
        ]}
      />
    );
  },
};

export const Animated = {
  render: () => {
    return (
      <MyersCanvas
        oldStr="CBAD"
        newStr="BCDA"
        animation={{
          borderDuration: 500,
          axisDuration: 500,
          diagonalsDuration: 500,
          highlightsDuration: 300,
          staggered: true,
        }}
        highlights={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, label: "1" },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 1 } },
          { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, label: "2" },
          { from: { x: 3, y: 1 }, to: { x: 4, y: 1 }, skipped: true },
          { from: { x: 3, y: 1 }, to: { x: 3, y: 2 }, label: "3" },
          { from: { x: 3, y: 2 }, to: { x: 4, y: 3 } },
          { from: { x: 4, y: 3 }, to: { x: 4, y: 4 }, label: "4" },
          { from: { x: 2, y: 1 }, to: { x: 2, y: 2 } },
          { from: { x: 2, y: 2 }, to: { x: 3, y: 2 }, label: "3" },
          { from: { x: 2, y: 2 }, to: { x: 2, y: 3 } },
          { from: { x: 2, y: 3 }, to: { x: 3, y: 4 } },
          { from: { x: 3, y: 4 }, to: { x: 4, y: 4 }, label: "4" },
          { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
          { from: { x: 0, y: 1 }, to: { x: 1, y: 2 } },
          { from: { x: 1, y: 2 }, to: { x: 2, y: 2 }, label: "2" },
          { from: { x: 1, y: 2 }, to: { x: 1, y: 3 } },
          { from: { x: 1, y: 3 }, to: { x: 2, y: 3 }, label: "3" },
          { from: { x: 1, y: 3 }, to: { x: 1, y: 4 }, skipped: true },
        ]}
      />
    );
  },
};
