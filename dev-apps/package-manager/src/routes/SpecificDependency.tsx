import { useRouteParamsState } from "@packages/router";
import { useFetchMetadata } from "../useTempRequest";
import { Spinner } from "@packages/loading";
import { usePath } from "@packages/router";
import { NPMRegistry } from "@packages/detect-repository-dependencies-types";
import { Typeahead } from "@packages/typeahead";

// TODO: Create fallback if dependency.length === 0.

export const SpecificDependency = () => {
  const { dependency } = useRouteParamsState();
  const decodedDependency = dependency ? decodeURIComponent(dependency) : undefined;
  const { data, isLoading, isError } = useFetchMetadata({ packageName: decodedDependency });

  if (isLoading) {
    return <Spinner />;
  }

  const { versions = {} } = data ?? {};
  const versionsArray = Object.keys(versions).map((version) => {
    return {
      label: version,
      value: version,
    };
  }).reverse();

  return <SpecificDependencyContent data={data} versions={versionsArray} />;
};

type SpecificDependencyContentProps = {
  data?: NPMRegistry;
  versions: {
    label: string;
    value: string;
  }[];
};

const SpecificDependencyContent = ({ data, versions }: SpecificDependencyContentProps) => {
  const { moveTo } = usePath();
  const { name, description } = data ?? {};

  return (
    <div>
      <button
        onClick={() => {
          moveTo({
            pathname: "/",
            overrideParams: true,
          });
        }}
      >
        Back to main
      </button>
      <div>{name}</div>
      <div>{description}</div>
      <Typeahead options={versions} callback={(picked) => console.log(picked)} />
    </div>
  );
};
