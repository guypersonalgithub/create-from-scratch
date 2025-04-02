import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";

export const Chroot = () => {
  return (
    <div>
      <StyledMainTitle>Chroot</StyledMainTitle>
      <div>
        Chroot is often called "change root" or "cha-root". Some even used to call it "Linux jail"
        or "jail process".
      </div>
      <div>It is a Linux command that alows to set the root directory of a new process.</div>
      <div>
        It means that for this Linux and all its children, only this directory and below are
        accessible.
      </div>
      <div>
        In the container use case, this is used to dictate where the container's root directory will
        be.
      </div>
    </div>
  );
};
