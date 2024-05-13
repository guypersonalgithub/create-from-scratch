export type GithubActionYaml = {
  name: string;
  env: Record<string, string>;
  on: Record<string, string | Record<string, string[]>>;
  jobs: Record<
    string,
    Record<string, string | Record<string, string | string>[]>
  >;
};
