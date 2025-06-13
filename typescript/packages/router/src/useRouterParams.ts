import { useRouterContext } from "./useRouterContext";

export const useRouteParamsState = () => {
  const withinRouter = useRouterContext();
  const { routeParams } = withinRouter;

  return routeParams.current;
};
