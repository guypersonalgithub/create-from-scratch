import type { Meta } from "@storybook/react";
import { Router, usePath } from "@packages/router";

const meta = {
  title: "Router",
  component: Router,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Router>;

export default meta;

export const Primary = {
  render: () => {
    const { moveTo } = usePath();

    return (
      <>
        <div style={{ display: "flex", gap: "5px" }}>
          <button onClick={() => moveTo({ pathname: "/" })}>First</button>
          <button onClick={() => moveTo({ pathname: "/1" })}>Second</button>
          <button onClick={() => moveTo({ pathname: "/2" })}>Third</button>
        </div>
        <Router
          wrapperStyle={{ margin: "20px" }}
          paths={{
            "/": () => {
              return (
                <div>
                  <h3>First</h3>
                </div>
              );
            },
            "/1": () => {
              return (
                <div>
                  <h3>Second</h3>
                </div>
              );
            },
            "/2": () => {
              return (
                <div>
                  <h3>Third</h3>
                </div>
              );
            },
          }}
        />
      </>
    );
  },
};
