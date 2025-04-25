import type { Meta, StoryObj } from "@storybook/react";
import { Key } from "@packages/keyboard-key";

const meta = {
  title: "Key",
  component: Key,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Key>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: "T",
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const InteractiveBasic: Story = {
  args: {
    children: "T",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Pronounced: Story = {
  args: {
    children: "T",
    variant: "pronounced",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Mac: Story = {
  args: {
    children: "T",
    variant: "mac",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Dark: Story = {
  args: {
    children: "T",
    variant: "dark",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Gaming: Story = {
  args: {
    children: "T",
    variant: "gaming",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Skeuomorphic: Story = {
  args: {
    children: "T",
    variant: "skeuomorphic",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Glassmorphism: Story = {
  args: {
    children: "T",
    variant: "glassmorphism",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Outline: Story = {
  args: {
    children: "T",
    variant: "outline",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Retro: Story = {
  args: {
    children: "T",
    variant: "retro",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Soft: Story = {
  args: {
    children: "T",
    variant: "soft",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Scifi: Story = {
  args: {
    children: "T",
    variant: "scifi",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Wood: Story = {
  args: {
    children: "T",
    variant: "wood",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Metal: Story = {
  args: {
    children: "T",
    variant: "metal",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};

export const Plastic: Story = {
  args: {
    children: "T",
    variant: "plastic",
    interactive: true,
  },
  render: (args) => {
    return <Key {...args} />;
  },
};
