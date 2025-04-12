import { IS_ROUTER, IS_SUB_ROUTER } from "@packages/router";

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

  for (const path in paths) {
    const current = paths[path];
    if (path[path.length - 1] === "!") {
    }
  }
  console.log(paths);
};

type FindRootArgs = {
  root: JSX.Element;
  isSubRouter?: boolean;
};

const findRoot = ({ root, isSubRouter }: FindRootArgs): JSX.Element | undefined => {
  const symbol = isSubRouter ? IS_SUB_ROUTER : IS_ROUTER;
  if (typeof root.type === "function" && symbol in root.type) {
    return root;
  }

  const { props } = root;

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
