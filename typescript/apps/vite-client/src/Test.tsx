import { AnimationContainerWrapper } from "@packages/animation-container";
import { useState } from "react";

export const Test = () => {
  const [test, setTest] = useState("test1");

  const switchTest = () => setTest((prev) => (prev === "test1" ? "test2" : "test1"));

  return (
    <>
      <button onClick={() => switchTest()}>click</button>
      <div
        style={{
          overflow: "hidden",
          height: "30px",
          position: "relative",
          width: "100%",
        }}
      >
        <AnimationContainerWrapper
          style={{
            display: "flex",
            width: "100%",
            position: "absolute",
          }}
          onMount={[
            { transform: "translateX(-100%)", opacity: 0 },
            { transform: "translateX(0)", opacity: 1 },
          ]}
          onUnmount={[
            { transform: "translateX(0)", opacity: 1 },
            { transform: "translateX(100%)", opacity: 0 },
          ]}
          mountOptions={{ duration: 1000 }}
          unmountOptions={{ duration: 1000 }}
          changeMethod="gradual"
        >
          <div
            key={test}
            style={{
              border: test === "test1" ? "1px solid red" : "1px solid blue",
            }}
          >
            {test}
          </div>
        </AnimationContainerWrapper>
      </div>
    </>
  );
};
