import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

export const Namespaces = () => {
  return (
    <div>
      <StyledMainTitle>Namespaces</StyledMainTitle>
      <div>Relevant for security and resources management.</div>
      <div>
        Regularly, even with different roots, it is possible to see other running processes that
        belong to a different root.
      </div>
      <div>
        Namespaces allow hiding processes from other processes. It even grants each root different
        PIDS (process ids) so they can't guess what others might have.
      </div>
      <div>
        That way, using different change root environments with their own associated namespaces for
        better isolation.
      </div>
      <div>
        Namespaces that hide processes are the UTS (or UNIX Timesharing) namespace. There are other
        namespaces that help with isolation aswell.
      </div>
    </div>
  );
};
