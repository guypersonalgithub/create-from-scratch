import { useRouteParamsState } from "@packages/router";
import { useFetchMetadata } from "../useTempRequest";
import { Spinner } from "@packages/loading";

// TODO: Create fallback if dependency.length === 0.

export const SpecificDependency = () => {
  const { dependency } = useRouteParamsState();
  const decodedDependency = dependency ? decodeURIComponent(dependency) : undefined;
  const { data, isLoading, isError } = useFetchMetadata({ packageName: decodedDependency });

  if (isLoading) {
    return <Spinner />;
  }

  return null;
};
