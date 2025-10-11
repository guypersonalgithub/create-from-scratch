import type { Meta, StoryObj } from "@storybook/react";
import { SixSidedDiceRoll, type SixSidedDiceRollRef } from "@packages/dice-roll";
import { useRef } from "react";
import { Button } from "@packages/button";

const meta = {
  title: "SixSidedDiceRoll",
  component: SixSidedDiceRoll,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SixSidedDiceRoll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => {
    const ref = useRef<SixSidedDiceRollRef>(null);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
          }}
        >
          <SixSidedDiceRoll {...args} diceRef={ref} />
        </div>
        <Button onClick={() => ref.current?.roll()} style={{ width: "fit-content" }}>
          Flip
        </Button>
      </div>
    );
  },
};
