import { SearchableCommands } from "../../../SearchableCommands";
import { StyledMainTitle } from "../../../styledComponents/StyledMainTitle";

export const Unshare = () => {
  return (
    <div>
      <StyledMainTitle>Unshare</StyledMainTitle>
      <div>
        Unshare is a Linux utility that runs a program with some namespaces unshared from the
        parent. This is used to create container-like environments or sandbox processes.
      </div>
      <SearchableCommands
        commands={[
          {
            command: "--mount",
            description:
              "Unshares the mount namespace. This means changes to mount points (e.g. mounting/unmounting filesystems) won't affect the host or other processes.",
          },
          {
            command: "--uts",
            description:
              "Unshares the UTS namespace. Lets the process set a different hostname and domain name from the rest of the system.",
          },
          {
            command: "--ipc",
            description:
              "Unshares the IPC namespace. Isolates System V IPC and POSIX message queues, preventing IPC with processes outside this namespace.",
          },
          {
            command: "--net",
            description:
              "Unshares the network namespace. The process gets its own network stack (interfaces, routing tables, etc.) — like a mini virtual machine. No network access unless set up manually inside the namespace.",
          },
          {
            command: "--pid",
            description:
              "Unshares the PID namespace. The process and its children get a new PID namespace; PID 1 inside it will be this process.",
          },
          {
            command: "--fork",
            description:
              "Forks the process after unsharing. Required with some namespaces like --pid because you can't unshare PID without forking — the change only takes effect for child processes.",
          },
          {
            command: "--user",
            description:
              "Unshares the user namespace. Allows mapping of user IDs and group IDs inside the namespace, e.g. a non-root user can appear as root inside the namespace.",
          },
          {
            command: "--map-root-user",
            description:
              "Maps your user ID to root inside the new user namespace. You'll have UID 0 (root) inside, but no real root powers on the host. Allows running commands as “root” inside the sandbox.",
          },
        ]}
      />
      <div>
        The command unshare --mount --uts --ipc --net --pid --fork --user --map-root-user runs a new
        process (shell or another command) in fully isolated namespaces: mount, network, UTS
        (hostname), IPC, PID, and user. It forks a child to make PID unsharing work, and gives you
        root privileges inside the namespace without needing root outside.
      </div>
      <div>
        You’ll get a root shell inside a container-like environment isolated from your system,
        without needing Docker or root access.
      </div>
    </div>
  );
};
