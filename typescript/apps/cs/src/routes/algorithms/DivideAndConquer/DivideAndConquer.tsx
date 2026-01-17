import { RouteredInnerSidebarContainer } from "../../../styledComponents/InnerSidebarContainer/RouteredInnerSidebarContainer";
import { DivideAndConquerRoot } from "./Root";

export const DivideAndConquer = () => {
  return (
    <RouteredInnerSidebarContainer
      items={[{ label: "Divide and Conquer Algorithm", value: "/algorithms/divide-and-conquer" }]}
      paths={{
        "/": <DivideAndConquerRoot />,
      }}
    />
  );
};
