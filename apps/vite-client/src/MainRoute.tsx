import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { testing } from "@packages/test";
import { useRequestExample } from "./hooks";
import { PostMessage } from "./PostMessage";
import { useFPS } from "@packages/get-fps";
import { Table } from "@packages/table";
import { EllipsisTooltip, Tooltip } from "@packages/tooltip";
import { AnimationContainerWrapper } from "@packages/animation-container";

export const MainRoute = () => {
  const [count, setCount] = useState(0);
  const [test, setTest] = useState(["test", "test1", "test2"]);
  useRequestExample();
  const fps = useFPS();

  const response = testing();

  const switchTest = () => {
    setTest((previous) => {
      if (previous.length > 2) {
        return ["test4"];
      }

      return ["test", "test1", "test2"];
    });
  };

  return (
    <div>
      <PostMessage />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">Received from another package: {response}</div>
      <div className="card">{fps.FPS}</div>
      <Tooltip
        content={
          "hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello"
        }
      >
        <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      </Tooltip>
      <EllipsisTooltip style={{ width: "50px" }}>Testing the ellipsis tooltip</EllipsisTooltip>
      <button onClick={() => switchTest()}>click</button>
      <AnimationContainerWrapper
        onMount={[
          { height: "0px", opacity: 0 },
          { height: "100px", opacity: 1 },
        ]}
      >
        {test.map((testChild) => {
          return <div key={testChild}>{testChild}</div>;
        })}
      </AnimationContainerWrapper>
      <Table
        rowContainer={{
          height: "50px",
        }}
        columns={[
          {
            header: "name",
            cell: (data) => {
              return (
                <Tooltip content={data.name}>
                  <div>{data.name}</div>
                </Tooltip>
              );
            },
            size: 50,
          },
          {
            header: "version",
            cell: (data) => {
              return <div>{data.version}</div>;
            },
            size: 100,
          },
        ]}
        data={[
          {
            name: "test",
            version: "123",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
          {
            name: "test2",
            version: "1234dfsfdsfds",
          },
        ]}
      />
    </div>
  );
};
