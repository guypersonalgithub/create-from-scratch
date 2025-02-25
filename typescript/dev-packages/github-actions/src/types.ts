export type GithubActionYaml = {
  name: string;
  description?: string;
  inputs?: Record<string, Record<string, string>>;
  outputs?: Record<string, Record<string, string>>;
  env?: Record<string, string>;
  on?: Record<string, string | Record<string, string[]>>;
  permissions?: Record<string, string>;
  jobs?: Record<
    string,
    {
      "runs-on"?: string;
      defaults?: Record<string, unknown>;
      steps?: {
        name?: string;
        run?: string | string[];
        uses?: string;
      }[];
    }
  >;
};

export type ActionYamlConfigProps = GithubActionYaml & {
  fileName?: string;
  dependencies?: {
    step: string;
  };
};
