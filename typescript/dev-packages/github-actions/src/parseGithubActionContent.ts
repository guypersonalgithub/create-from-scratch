import { writeFileSync } from "fs";
import { type GithubActionYaml } from "./types";
import { convertObjectToYaml } from "@packages/yaml";
import { getConfiguration } from "./getConfiguration";
import { removeQuotationMarks } from "@packages/string-utils";

type ParseGithubActionContentArgs = {
  file: string;
  folderPath: string;
  projectCompleteRootAbsolutePath: string;
  onPushCallback?: (args: { onPush: Record<string, string[]> }) => void;
  onPullRequest?: (args: { onPull: Record<string, string[]> }) => void;
  stepCallbacks?: Record<
    string,
    (args: {
      step: {
        name?: string;
        run?: string | string[];
        uses?: string;
      };
    }) => void
  >;
};

export const parseGithubActionContent = ({
  file,
  folderPath,
  projectCompleteRootAbsolutePath,
  onPushCallback,
  onPullRequest,
  stepCallbacks = {},
}: ParseGithubActionContentArgs) => {
  const filePath = `${folderPath}/${file}`;
  const config = getConfiguration({ filePath });
  if (!config) {
    return;
  }

  const {
    name,
    description,
    inputs = {},
    outputs = {},
    env = {},
    on = {},
    permissions = {},
    jobs,
    fileName = file,
  } = config;

  const hasNoOnProperties = Object.keys(on).length === 0;

  const { push, pull_request } = on;
  if (push && onPushCallback && typeof push !== "string") {
    onPushCallback({ onPush: push });
  }

  if (pull_request && onPullRequest && typeof pull_request !== "string") {
    onPullRequest({ onPull: pull_request });
  }

  // if (!hasNoOnProperties) {
  //   on.workflow_dispatch = "";
  // }

  for (const job in jobs) {
    const { steps } = jobs[job];
    if (!Array.isArray(steps)) {
      continue;
    }

    steps.forEach((step, index) => {
      const { name, run } = step;
      if (typeof name !== "string") {
        return;
      }

      const stepCallback = stepCallbacks[name];
      stepCallback?.({ step });

      const currentStep = config.jobs?.[job].steps?.[index];
      if (!currentStep || !Array.isArray(run) || typeof currentStep === "string") {
        return;
      }

      currentStep.run = run.join("\n");
    });
  }

  const githubActionYaml: GithubActionYaml = {
    name,
    description,
    inputs,
    outputs,
    env,
    on,
    permissions,
    jobs,
  };

  if (!description) {
    delete githubActionYaml.description;
  }

  if (Object.keys(inputs).length === 0) {
    delete githubActionYaml.inputs;
  }

  if (Object.keys(outputs).length === 0) {
    delete githubActionYaml.outputs;
  }

  if (Object.keys(env).length === 0) {
    delete githubActionYaml.env;
  }

  if (hasNoOnProperties) {
    delete githubActionYaml.on;
  }

  if (Object.keys(permissions).length === 0) {
    delete githubActionYaml.permissions;
  }

  const yamlFormat = convertObjectToYaml({ obj: githubActionYaml });

  const fileNameWithoutQuotationMarks = removeQuotationMarks({ str: fileName });

  writeFileSync(
    `${projectCompleteRootAbsolutePath}/.github/workflows/${fileNameWithoutQuotationMarks}.yaml`,
    yamlFormat,
  );
};
