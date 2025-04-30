import { StyledMainTitle, StyledSubTitle } from "../../styledComponents/StyledMainTitle";

export const Cgroups = () => {
  return (
    <div>
      <StyledMainTitle>Cgroups</StyledMainTitle>
      <div>Also called control groups.</div>
      <div>Relevant for security and resources management.</div>
      <div>
        Cgroups help us manage resources of containers, how much resources are allocated to each
        container.
      </div>
      <div>
        There are multiple cgroups versions. In order to check the version, the following command
        should be ran:
      </div>
      <p>
        <b>grep -c cgroup /proc/mounts</b>
      </p>
      <div>
        Getting a value other than 0 or 1, means that the operating system is using cgroups v1 and
        not v2, and that may require upgrading the operating system.
      </div>
      <div>
        Since this is mainly relevant to containers (unless there is a desire to allocate and
        isolate containers within an actual Linux based operating system computer), it is possible
        to just use a more recent version of Ubuntu or other Linux based images.
      </div>
      <div>Consider avoiding relying on cgroups v1 as they are getting deprecated.</div>
      <StyledSubTitle>Interaction with cgroups</StyledSubTitle>
      <div>Interacting with cgroups is through a pseudo file system</div>
      <div>
        By running <b>cd /sys/fs/cgroup</b> and then running <b>ls</b> it is possible to many files
        will be listed - by interacting with these files we will be able to interact with the
        cgroups themselves.
      </div>
      <div>
        For example, writing in that folder cat <b>cpu.max</b> will list what its current
        configuration is at the moment.
      </div>
      <div>
        <b>io.max</b> is how fast it is possible to write to the disc.
      </div>
      <div>
        <b>memory</b> related files govern the RAM.
      </div>
      <div>
        <b>cgroups threads</b> is how many threads it can spawn.
      </div>
      <div>
        The root also have a cgroup with its own files and resources, however, they shouldn't be
        limited as we don't usually want to limit the root user artificially.
      </div>
      <div>
        In order to create our own cgroups, such as <b>cd {"{folderName}"}</b> it automatically
        creates files within it, assuming the command happens within the cgroups folder.
      </div>
      <div>However, it doesn't necessarily create all of them automatically.</div>
      <div>
        In order to add the unshared environments to the custom made cgroup, we first have to run{" "}
        <b>ps aux</b> like before, and find the unshared environment.
      </div>
      <div>
        The process that comes after the unshare if the process we are supposed to be adding.
      </div>
      <div>
        We need to take the PID of the process, and use the following{" "}
        <b>
          echo {"{PID} >"} /sys/fs/cgroup/{"{folderName}"}/cgroup.procs
        </b>
      </div>
      <div>That way, we add a process that belongs to that cgroup.</div>
      <div>
        <b>A process can only belong to one cgroup.</b>
      </div>
      <div>
        Moving a process to another cgroup automatically removes it from the one it previously
        belonged to.
      </div>
      <div>
        <b>
          As long as a cgroup has any processes that belong to it, its not possible to modify what
          subtree controllers are available to it.
        </b>
      </div>
      <div>
        In order to activate the subtree controller for a cgroup, all the associated cgroups need to
        temporarily be moved to another cgroup.
      </div>
      <div>
        So initially we might needt to move all processes from the initial cgroups one by one, as
        the command cannot support moving multiple processes at once.
      </div>
      <div>
        Then we can run{" "}
        <b>
          echo "+cpuset +cpu +io +memory +hugetlb +pids +rdma" {">"}{" "}
          /sys/fs/cgroup/cgroup.subtree_control
        </b>{" "}
        (the pluses just mean to add all of the things after them to the subtree controller.)
      </div>
      <div>
        In order to make all of the controllers available to a the child cgroup that was created
        before.
      </div>
      <StyledSubTitle>Limiting resources with cgroups</StyledSubTitle>
      <div></div>
    </div>
  );
};
