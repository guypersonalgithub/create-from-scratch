export type TreeNode<T extends string> = {
  id: T;
  label: string;
  children?: TreeNode<T>[];
};
