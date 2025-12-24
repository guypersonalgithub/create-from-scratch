import { SubRouter } from "@packages/router";
import { AlgorithmsRoot } from "./Root";
import { Myers } from "./Myers/Myers";

export const Algorithms = () => {
  return (
    <SubRouter
      paths={{
        "/": <AlgorithmsRoot />,
        "/myers!": <Myers />
      }}
    />
  );
};
