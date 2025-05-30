import { getAvailableDockerProfiles, runDockerContainersByProfile } from "@packages/docker";
import { multiSelect } from "@packages/terminal-multi-select";

type RunDockerContainersArgs = {
  pickedContainers: string[];
};

export const runDockerContainers = async ({ pickedContainers }: RunDockerContainersArgs) => {
  const containers: string[] = pickedContainers;

  if (containers.length === 0) {
    const profiles = getAvailableDockerProfiles();

    const options = profiles.map((profile) => {
      return {
        value: profile,
        label: profile,
      };
    });

    const selectedOptions = await multiSelect({
      options,
      prefixText: "Please pick the containers you'd like to run:\n",
      suffixText: "\nPress Space to toggle selection, Enter to confirm",
      isMultiSelect: true,
    });

    selectedOptions.forEach((option) => {
      containers.push(option.value);
    });
  }

  await runDockerContainersByProfile({ profiles: pickedContainers });
};
