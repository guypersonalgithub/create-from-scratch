import { createRoot } from "react-dom/client";
import { type JSX } from "react";

export const testRoot = document.createElement("div");
document.body.appendChild(testRoot);

type RenderArgs = {
  Component: JSX.Element;
};

export const render = ({ Component }: RenderArgs) => {
  testRoot.innerHTML = ""; // clean up previous render
  const root = createRoot(testRoot);
  root.render(Component);
  return testRoot;
};
