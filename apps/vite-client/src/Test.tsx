import React, { useState } from "react";
import { AnimationContainer2, FadeComponent } from "@packages/animation-container";

// This is a temporary file.

export const Test: React.FC = () => {
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const toggleVisibility1 = () => {
    setIsVisible1((prev) => !prev); // Toggle visibility state for component 1
  };

  const toggleVisibility2 = () => {
    setIsVisible2((prev) => !prev); // Toggle visibility state for component 2
  };

  return (
    <div style={{ padding: "50px" }}>
      <button onClick={toggleVisibility1}>Toggle Visibility 1</button>
      <button onClick={toggleVisibility2}>Toggle Visibility 2</button>
      <AnimationContainer2>
        {isVisible1 && <FadeComponent unique="hello" />}
        {isVisible2 && <FadeComponent unique="bye" />}
      </AnimationContainer2>
      {/* <div
        className={`${isVisible1 ? "fade-enter fade-enter-active" : "fade-exit fade-exit-active"}`}
      >
        ???
      </div> */}
    </div>
  );
};
