import { SearchableCommands } from "../../SearchableCommands";
import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

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
            command: "cat /etc/issue",
            description: "allows seeing what version of Linux is currently being ran.",
          },
          {
            command: "pwd",
            description:
              "present working directory, prints the current location the terminal is at.",
          },
          {
            command: "mkdir {name}",
            description: "make a new directory with the given {name}.",
          },
          {
            command: "ls",
            description: "list files in the current directory except for hidden files.",
          },
          {
            command: "echo {text}",
            description: "prints {text}.",
          },
          {
            command: "echo {text} >> {file}",
            description: "Adds the {text} into {file} and creates it if it doesn't already exist.",
          },
          {
            command: "cat {file}",
            description: "primarly used to read, display and concatenate the text in {file}.",
          },
          {
            command: "chroot {new root} {after}",
            description:
              "used to change the root directory of the current environment to the {new root}, and then tells it what to do {after}.",
          },
          {
            command: "ldd {file path}",
            description: "lists all the dynamic dependencies required in the {file path}.",
          },
          {
            command: "{arguments}",
            description:
              "the curly braces mean doing all arguments in them. For example, {x}{, 64} will add both an empty string and 64 on different iterations to {x} and would result in {x} and {x}64.",
          },
          {
            command: "cp {path} {new path}",
            description:
              "copies the files from {path} to {new path}. You may add any number of paths you'd like. They will always be copied to the last one.",
          },
          {
            command: "exit",
            description: "exists the current root.",
          },
        ]}
      />
    </div>
  );
};
