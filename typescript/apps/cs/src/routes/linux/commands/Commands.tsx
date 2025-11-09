import { SubRouter } from "@packages/router";
import { SearchableCommands } from "../../../SearchableCommands";
import { StyledLinksContainer } from "../../../styledComponents/StyledLinksContainer";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";
import { useStickSubRouterLinksToTop } from "../../../useStickSubRouterLinksToTop";
import { Unshare } from "./Unshare";
import { Mount } from "./Mount";

export const Commands = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

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
            description: "Allows seeing what version of Linux is currently being ran.",
          },
          {
            command: "pwd",
            description:
              "Present working directory, prints the current location the terminal is at.",
          },
          {
            command: "mkdir {name}",
            description: "Makes a new directory with the given {name}.",
          },
          {
            command: "ls",
            description: "List files in the current directory except for hidden files.",
          },
          {
            command: "echo {text}",
            description: "Prints {text}.",
          },
          {
            command: "echo {text} >> {file}",
            description: "Adds the {text} into {file} and creates it if it doesn't already exist.",
          },
          {
            command: "cat {file}",
            description: "Primarly used to read, display and concatenate the text in {file}.",
          },
          {
            command: "chroot {new root} {after}",
            description:
              "Used to change the root directory of the current environment to the {new root}, and then tells it what to do {after}.",
          },
          {
            command: "ldd {file path}",
            description: "Lists all the dynamic dependencies required in the {file path}.",
          },
          {
            command: "{arguments}",
            description:
              "The curly braces mean doing all arguments in them. For example, {x}{, 64} will add both an empty string and 64 on different iterations to {x} and would result in {x} and {x}64.",
          },
          {
            command: "cp {path} {new path}",
            description:
              "Copies the files from {path} to {new path}. You may add any number of paths you'd like. They will always be copied to the last one.",
          },
          {
            command: "exit",
            description: "Exits the current root.",
          },
          {
            command: "ps",
            description:
              "Process status - displays information related to the processes running in a Linux system.",
          },
          {
            command: "ps aux",
            description:
              "The aux options modify the ps command to display all processes on a system.",
          },
          {
            command: "kill -9 {process id}",
            description:
              "Sends a SIGKILL signal to a service with the {process id}, shutting it down immediately.",
          },
          {
            command: "tail -f {path}",
            description:
              "The tail command on Linux/Unix like system is a convenient way of displaying and monitoring log files on any system on {path}, which is very useful if you are trying to debug a problem on a server machine.",
          },
          {
            command: "unshare",
            description:
              "A Linux utility that runs a program with some namespaces unshared from the parent. This is used to create container-like environments or sandbox processes.",
          },
        ]}
      />
      <div ref={ref}>
        <StyledLinksContainer
          ref={childRef}
        // containerClassName={dynatic`
        //   position: sticky;
        //   margin-top: -8px;
        // `}
          links={[
            { path: "/linux/commands", children: "Commands" },
            { path: "/linux/commands/unshare", children: "Unshare" },
            { path: "/linux/commands/mount", children: "Mount" },
          ]}
        />
        <SubRouter
          paths={{
            "/": <></>,
            "/unshare": <Unshare />,
            "/mount": <Mount />,
          }}
        />
      </div>
    </div>
  );
};
