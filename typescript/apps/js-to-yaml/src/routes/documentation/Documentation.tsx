import { SubRouter } from "@packages/router";

export const Documentation = () => {
  return (
    <SubRouter
      paths={{
        "/": () => {
          return <>Documentation</>;
        },
      }}
    />
  );
};
