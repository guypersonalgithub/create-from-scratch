import { useRouteParamsState } from "@packages/router";

export const SpecificDependency = () => {
  const params = useRouteParamsState();
  console.log(params);

  return null;
};
