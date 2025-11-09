import { AnimationContainerWrapper } from "@packages/animation-container";
import { dynatic } from "@packages/dynatic-css";
import { useState } from "react";

export const Test = () => {
  const [test, setTest] = useState("test1");

  const switchTest = () => setTest((prev) => (prev === "test1" ? "test2" : "test1"));

  return (
    <>
      <button onClick={() => switchTest()}>click</button>
      <div
        className={dynatic`
          overflow: hidden;
          height: 30px;
          position: relative;
          width: 100%;
        `}
      >
        <AnimationContainerWrapper
          className={dynatic`
            display: flex;
            width: 100%;
            position: absolute;  
          `}
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
            className={
              test === "test1"
                ? dynatic`
                    border: 1px solid red;
                  `
                : dynatic`
                    border: 1px solid blue;
                  `
            }
          >
            {test}
          </div>
        </AnimationContainerWrapper>
      </div>
    </>
  );
};
