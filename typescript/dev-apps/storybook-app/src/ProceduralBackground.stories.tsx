import type { Meta } from "@storybook/react";
import { ProceduralBackground } from "@packages/procedural-background";
import { useState } from "react";

const meta = {
  title: "ProceduralBackground",
  component: ProceduralBackground,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ProceduralBackground>;

export default meta;

export const Primary = {
  render: () => {
    return (
      <div>
        <ProceduralBackground mode="waves" colors={["#0f172a", "#0ea5e9"]} intensity={0.6} />
        <ProceduralBackground mode="noise" seed={123} speed={0.2} />
        <ProceduralBackground mode="particles" particleCount={80} />
      </div>
    );
  },
};
