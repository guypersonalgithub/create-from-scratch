import type { Meta, StoryObj } from "@storybook/react";
import { WheelOfFortune, type WheelOfFortuneRef } from "@packages/wheel-of-fortune";
import { useRef } from "react";
import { Button } from "@packages/button";

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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "500px",
            height: "500px",
          }}
        >
          <WheelOfFortune {...args} wheelRef={ref} onAnimationEnd={(test) => console.log(test)} />
        </div>
        <Button onClick={() => ref.current?.spin()} style={{ width: "fit-content" }}>
          Rotate
        </Button>
      </div>
    );
  },
};
