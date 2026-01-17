import { SubRouter } from "@packages/router";
import { AlgorithmsRoot } from "./Root";
import { Myers } from "./Myers/Myers";
import { DivideAndConquer } from "./DivideAndConquer/DivideAndConquer";

export const Algorithms = () => {
  return (
    <SubRouter
      paths={{
        "/": <AlgorithmsRoot />,
        "/myers!": <Myers />,
        "/divide-and-conquer": <DivideAndConquer />,
      }}
    />
  );
};
