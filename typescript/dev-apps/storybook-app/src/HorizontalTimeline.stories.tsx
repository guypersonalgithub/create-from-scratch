import type { Meta, StoryObj } from "@storybook/react";
import { HorizontalTimeline } from "@packages/timeline";

const meta = {
  title: "HorizontalTimeline",
  component: HorizontalTimeline,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HorizontalTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    events: [
      {
        id: "1",
        date: "January 2024",
        title: "Project Kickoff",
        description:
          "Started the new React project with initial planning and team setup. Defined project scope and technical requirements.",
        type: "success",
      },
      {
        id: "2",
        date: "February 2024",
        title: "Design Phase",
        description:
          "Completed UI/UX design mockups and user flow diagrams. Conducted user research and gathered feedback from stakeholders.",
        type: "default",
      },
      {
        id: "3",
        date: "March 2024",
        title: "Development Sprint 1",
        description:
          "Implemented core functionality including user authentication, database setup, and basic CRUD operations.",
        type: "default",
      },
      {
        id: "4",
        date: "April 2024",
        title: "Testing & Bug Fixes",
        description:
          "Conducted comprehensive testing, identified critical bugs, and implemented fixes. Performance optimization completed.",
        type: "warning",
      },
      {
        id: "5",
        date: "May 2024",
        title: "Production Deployment",
        description:
          "Successfully deployed the application to production environment. Monitoring and analytics setup completed.",
        type: "success",
      },
      {
        id: "6",
        date: "June 2024",
        title: "Post-Launch Issues",
        description:
          "Encountered some performance issues with high traffic. Working on scaling solutions and infrastructure improvements.",
        type: "error",
      },
    ],
  },
  render: (args) => {
    return <HorizontalTimeline {...args} />;
  },
};
