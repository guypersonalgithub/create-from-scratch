import type { Meta, StoryObj } from "@storybook/react";
import { WheelOfFortune, type WheelOfFortuneRef } from "@packages/wheel-of-fortune";
import { useRef } from "react";
import { Button } from "@packages/button";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "WheelOfFortune",
  component: WheelOfFortune,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WheelOfFortune>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    options: [
      "1000",
      "2000",
      "3000",
      "4000",
      "5000",
      "6000",
      "7000",
      "8000",
      "9000",
      "10000",
      "11000",
      "12000",
    ],
  },
  render: (args) => {
    const ref = useRef<WheelOfFortuneRef>(null);

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
            width: 500px;
            height: 500px;
          `}
        >
          <WheelOfFortune {...args} wheelRef={ref} onAnimationEnd={(test) => console.log(test)} />
        </div>
        <Button
          onClick={() => ref.current?.spin()}
          className={dynatic`
            width: fit-content;
          `}
        >
          Rotate
        </Button>
      </div>
    );
  },
};
