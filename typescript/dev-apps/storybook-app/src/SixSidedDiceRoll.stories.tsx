import type { Meta, StoryObj } from "@storybook/react";
import { SixSidedDiceRoll, type SixSidedDiceRollRef } from "@packages/dice-roll";
import { useRef } from "react";
import { Button } from "@packages/button";
import { dynatic } from "@packages/dynatic-css";

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
      <div
        className={dynatic`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <div
          className={dynatic`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 500px;
          `}
        >
          <SixSidedDiceRoll {...args} diceRef={ref} />
        </div>
        <Button
          onClick={() => ref.current?.roll()}
          className={dynatic`
            width: fit-content;
          `}
        >
          Flip
        </Button>
      </div>
    );
  },
};
