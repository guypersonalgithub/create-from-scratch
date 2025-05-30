export type Test = {
  name: string;
  fn: () => void | Promise<void>;
};
