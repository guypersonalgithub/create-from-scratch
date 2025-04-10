import { IS_ROUTER } from "@packages/router";

type MapRoutesArgs = {
  root: JSX.Element;
};

export const mapRoutes = ({ root }: MapRoutesArgs) => {
  const fullPaths = [];

  const current = findRoot({ root });
  if (!current) {
    return;
  }

  console.log(current);

  const { props } = current;
  const { paths } = props;
  console.log(paths);
};

type FindRootArgs = {
  root: JSX.Element;
};

const findRoot = ({ root }: FindRootArgs): JSX.Element | undefined => {
  const { props } = root;

  if (typeof root.type === "function" && IS_ROUTER in root.type) {
    return root;
  }

  const { children } = props;

  if (!children) {
    return;
  }

  for (let i = 0; i < children.length; i++) {
    const child: JSX.Element = children[i];
    const currentRoot = findRoot({ root: child });
    if (currentRoot) {
      return currentRoot;
    }
  }
};
