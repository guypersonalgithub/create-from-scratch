import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "@packages/stepper";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "Stepper",
  component: Stepper,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    steps: [
      { label: "Test", content: <></> },
      { label: "Test123", content: <></> },
      { label: "Test1234", content: <></> },
      { label: "Test1235", content: <></> },
      { label: "Test1236", content: <></> },
    ],
    progressBarClassName: dynatic`
        border: 1px solid black;
        border-radius: 10px;
        overflow: hidden;
    `,
    innerProgressbarClassName: dynatic`
        background: linear-gradient(90deg, #e74c3c, #ff4c4c, #ff1a1a);
        height: 15px;
    `,
    stepClassName: dynatic`
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: #444;
        transition: all 0.3s ease;
        color: white;
        font-weight: bold;
        font-size: 18px;

        &:hover {
            box-shadow: 0 0 20px #ff4c4c, 0 0 30px #e74c3c55, 0 0 50px #ff1a1a33;
            background-color: #e74c3c;
        }
    `,
    currentStepClassName: dynatic`
        box-shadow: 0 0 20px #ff4c4c, 0 0 30px #e74c3c55, 0 0 50px #ff1a1a33;
        background-color: #e74c3c;
    `,
  },
  render: (args) => <Stepper {...args} />,
};
