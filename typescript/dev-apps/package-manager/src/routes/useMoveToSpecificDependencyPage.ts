import { usePath } from "@packages/router";

type MoveToDependencyPageArgs = {
  name: string;
};

export const useMoveToSpecificDependencyPage = () => {
  const { moveTo } = usePath();
  
  const moveToDependencyPage = ({ name }: MoveToDependencyPageArgs) => {
    moveTo({
      pathname: `/dependency/${encodeURIComponent(name)}`,
      overrideParams: true,
    });
  };

  return { moveToDependencyPage };
};
