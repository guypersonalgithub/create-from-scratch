import { StyledMainTitle, StyledSubTitle } from "../../../styledComponents/StyledMainTitle";

export const ForkBombAttack = () => {
  return (
    <div>
      <StyledMainTitle>Fork Bomb attack</StyledMainTitle>
      <div>Also called rabbit virus.</div>
      <div>
        A denial of service (DOS) attack in which a process continually replicates itself to deplete
        available system resources, slowing down or crashing the system due to resource starvation.
      </div>
      <StyledSubTitle>Prevention</StyledSubTitle>
      <div>
        As a fork bomb's mode of operation is entirely encapsulated by creating new processes, one
        way of preventing a fork bomb from severely affecting the entire system is to limit the
        maximum number of processes that a single user may own.
      </div>
      <div>
        Can be done on Linux using the unlimit utility, such as <b>unlimit -u {"{number}"}</b> would
        limit the affected user to a maximum of {"{number}"} owned processes.
      </div>
      <div>
        Modern Linux systems also allow finer-grained fork bomb prevention through cgroups and
        process number (PID) controllers.
      </div>
    </div>
  );
};
