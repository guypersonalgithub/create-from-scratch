import type { Meta } from "@storybook/react";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
  ChangeMethod,
} from "./AnimationContainerWrapper";
import { useState } from "react";

const meta = {
  title: "AnimationContainerWrapper",
  component: AnimationContainerWrapper,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AnimationContainerWrapper>;

export default meta;

type ExampleProps = {
  changeMethod: ChangeMethod;
};

const SingleExample = ({ changeMethod }: ExampleProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible((prev) => !prev)}>Click</button>
      <AnimationContainerWrapper
        onMount={[{ opacity: 0 }, { opacity: 1 }]}
        changeMethod={changeMethod}
      >
        {isVisible ? <div key="test">test</div> : <div key="test2">test2</div>}
      </AnimationContainerWrapper>
    </>
  );
};

const MultiExample = ({ changeMethod }: ExampleProps) => {
  const [currentChildren, setCurrentChildren] = useState(["test", "test1", "test2"]);

  return (
    <>
      <button
        onClick={() =>
          setCurrentChildren((previous) => {
            if (previous.length > 2) {
              return ["test3"];
            }

            return ["test", "test1", "test2"];
          })
        }
      >
        Click
      </button>
      <AnimationContainerWrapper
        onMount={[
          { height: "0px", opacity: 0 },
          { height: "100px", opacity: 1 },
        ]}
        changeMethod={changeMethod}
        style={{ border: "1px solid red" }}
      >
        {currentChildren.map((currentChild) => {
          return <div key={currentChild}>{currentChild}</div>;
        })}
      </AnimationContainerWrapper>
    </>
  );
};

const MultiUnmountExample = ({ changeMethod }: ExampleProps) => {
  const [currentChildren, setCurrentChildren] = useState(["test", "test1", "test2"]);

  return (
    <>
      <button
        onClick={() =>
          setCurrentChildren((previous) => {
            if (previous.length > 2) {
              return ["test3"];
            }

            return ["test", "test1", "test2"];
          })
        }
      >
        Click
      </button>
      <AnimationContainerUnmountWrapper changeMethod={changeMethod}>
        {currentChildren.map((currentChild) => {
          return (
            <AnimationContainerWrapper
              key={currentChild}
              onMount={[
                { height: "0px", opacity: 0 },
                { height: "100px", opacity: 1 },
              ]}
              changeMethod={changeMethod}
              style={{ border: "1px solid red" }}
            >
              <div key={currentChild}>{currentChild}</div>
            </AnimationContainerWrapper>
          );
        })}
      </AnimationContainerUnmountWrapper>
    </>
  );
};

export const SingleFullPhase = {
  render: () => <SingleExample changeMethod="fullPhase" />,
};

export const SingleGradual = {
  render: () => <SingleExample changeMethod="gradual" />,
};

export const MultiFullPhase = {
  render: () => <MultiExample changeMethod="fullPhase" />,
};

export const MultiGradual = {
  render: () => <MultiExample changeMethod="gradual" />,
};

export const AnimationUnmountWrapperExample = {
  render: () => <MultiUnmountExample changeMethod="fullPhase" />,
};

export const NonLifecycleExample = {
  render: () => {
    const [isLarge, setIsLarge] = useState(false);

    return (
      <>
        <button onClick={() => setIsLarge((prev) => !prev)}>Click</button>
        <AnimationContainerWrapper
          animation={
            isLarge
              ? [{ width: "50px" }, { width: "300px" }]
              : [{ width: "300px" }, { width: "50px" }]
          }
          style={{ backgroundColor: "black", color: "white" }}
        >
          <div>test</div>
        </AnimationContainerWrapper>
      </>
    );
  },
};
