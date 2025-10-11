import { createRoot } from "react-dom/client";
import { type JSX } from "react";

export let testRoot: HTMLElement | null = null;

if (typeof document !== "undefined") {
  testRoot = document.createElement("div");
  document.body.appendChild(testRoot);
}

type RenderArgs = {
  Component: JSX.Element;
};

export const render = ({ Component }: RenderArgs) => {
  if (!testRoot) {
    return;
  }

  testRoot.innerHTML = ""; // clean up previous render
  const root = createRoot(testRoot);
  root.render(Component);
  return testRoot;
};
