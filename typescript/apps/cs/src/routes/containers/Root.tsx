import { StyledMainTitle, StyledSubTitle } from "../../styledComponents/StyledMainTitle";

export const Root = () => {
  return (
    <div>
      <StyledMainTitle>Containers</StyledMainTitle>
      <div>
        A container is a mixture of a couple of Linux features used together to achieve isolation.
      </div>
      <StyledMainTitle>Why containers are needed</StyledMainTitle>
      <StyledSubTitle>Bare Metal</StyledSubTitle>
      <div>
        Back in the day, in order to run a web server, people needed to set up or rent a server
        somewhere. It was often referenced as "bare metal" because the code was executing on the
        processor with no abstraction.
      </div>
      <div>That method was great for performance sensitive tasks, but it was inflexible.</div>
      <div>
        For instance, adding more servers took much more time and effort due to the dependency of
        hardware.
      </div>
      <StyledSubTitle>Virtual Machines</StyledSubTitle>
      <div>
        A virtual machine adds a layer of abstraction between the virtual machine and the metal.
      </div>
      <div>
        Now instead of running a single instance of an operation system on a computer, it is
        possible to run multiple instances of a host instance of an operation system.
      </div>
      <div>
        Through that, it is possible to have better flexibility and resources management. If a new
        service needs to be ran, it can be easy to spin up a new virtual machine on one of the
        servers if enough resources are available.
      </div>
      <div>
        This also offers the ability to completely separate multiple virtual machines from each
        other on the same machine.
      </div>
      <div>
        Since only a limitd amount of resources is offered from the host operating system to the
        virtual machine's operating system, and they are totally isolated from each other, if one of
        them crashes, the other wouldn't necessarily be affected.
      </div>
      <div>
        Even though there is an abstraction between the virtual machine and the metal, the virtual
        machine instances are still running on it.
      </div>
      <div>
        Obviously, any layer of abstraction adds additional performance costs and complexity.
        Running an operating system inside an operating system isn't free. However, most of the time
        the memory and computing power costs aren't necessarily the primary concern. However, these
        costs are easily outweighted by the advantages virtual machines create, most of the time.
      </div>
      <StyledSubTitle>Public Cloud</StyledSubTitle>
      <div>
        Through public cloud, it is possible to get a virtual machine from cloud providers with
        pre-allocated amount of memory and computing power, often called{" "}
        <b>virtual cores or vCores</b> as they are dedicating cores to the virtual machine.
      </div>
      <div>This entirely removes the need to have physical machines somewhere.</div>
      <div>
        With this method, cloud providers take care of the hardware and make sure its up to date,
        while the software is fully managed by the developers.
      </div>
      <div>
        With this method, it is possible to spin up and down virtual machines with ease, getting the
        ability to easily access a massive amount of resources primarly based off costs.
      </div>
      <div>
        However, managing the software, networking, provisioning, updating, etc, are still required
        to be managed by the developers, for all of the servers.
      </div>
      <div>
        Also, it is still paying the cost of running a whole operating system in the cloud inside of
        a host operating system.
      </div>
      <StyledSubTitle>Containers</StyledSubTitle>
      <div>
        Containers give many of the security and resource-management features of virtual machines
        without the cost of having to run a whole other operating system.
      </div>
      <div>
        It instead uses chroot, namespace and cgroup to separate a group of processes from each
        other.
      </div>
      <div>
        Containers have strong security boundaries, but not necessarily as much as virtual machines.
      </div>
      <div>There are ways to run containers as full virutal machines if required to do so.</div>
    </div>
  );
};
