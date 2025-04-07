import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { SearchableCommands } from "../../../SearchableCommands";

export const Commands = () => {
  return (
    <div>
      <StyledMainTitle>Commands</StyledMainTitle>
      <div>
        <b>docker run</b> - each docker related command should start with docker run.
      </div>
      <SearchableCommands
        commands={[
          {
            command: "run",
            description:
              "This is how to run a container. Running a docker container with a distribution that wasn't cached locally would require docker to download the associated files.",
          },
          {
            command: "--it",
            description: "Make the container interactive.",
          },
          {
            command: "--name",
            description:
              "Assigns a name to the container, otherwise a random name would be generated.",
          },
          {
            command: "--rm",
            description: "Whenever the container is stopped, delete everything associated with it.",
          },
          {
            command: "--privileged",
            description:
              "Elevates the container to the root privilege. Normally we don't want to use that for the sake of security reasons.",
          },
          {
            command: `{distribution}:{version}`,
            description:
              "The distribution the the type of distribution the container will be running with, and the version is the version of said distribution.",
          },
        ]}
      />
    </div>
  );
};
