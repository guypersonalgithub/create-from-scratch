import { SubRouter } from "@packages/router";
import { DocumentationMain } from "./DocumentationMain";

export const Documentation = () => {
  return (
    <SubRouter
      paths={{
        "/": <DocumentationMain />,
      }}
    />
  );
};
