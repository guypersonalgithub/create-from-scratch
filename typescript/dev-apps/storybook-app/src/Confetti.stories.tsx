import type { Meta, StoryObj } from "@storybook/react";
import { ConfettiManager, useControlConfetti } from "@packages/confetti";
import { Button } from "@packages/button";

const meta = {
  title: "Confetti",
  component: ConfettiManager,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ConfettiManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => {
    const { showConfetti } = useControlConfetti();

    return (
      <div>
        <Button
          onClick={() =>
            showConfetti({
              x: 150,
              y: 150,
            })
          }
        >
          Click
        </Button>
        <ConfettiManager />
      </div>
    );
  },
};
