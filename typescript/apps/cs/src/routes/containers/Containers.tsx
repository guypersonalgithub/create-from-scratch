import { SubRouter } from "@packages/router";
import { StyledLinksContainer } from "../../styledComponents/StyledLinksContainer";
import { useStickSubRouterLinksToTop } from "../../useStickSubRouterLinksToTop";
import { Root } from "./Root";
import { Chroot } from "./Chroot";
import { Docker } from "./docker/Docker";
import { Namespaces } from "./Namespaces";
import { Cgroups } from "./Cgroups";

export const Containers = () => {
  const { ref, childRef } = useStickSubRouterLinksToTop();

  return (
    <div ref={ref}>
      <StyledLinksContainer
        ref={childRef}
        containerStyle={{ position: "sticky", marginTop: "-8px" }}
        links={[
          { path: "/containers", children: "Containers" },
          { path: "/containers/chroot", children: "Chroot" },
          { path: "/containers/docker", children: "Docker" },
          { path: "/containers/namespaces", children: "Namepsaces " },
          { path: "/containers/cgroups", children: "Cgroups" },
        ]}
      />
      <SubRouter
        paths={{
          "/": <Root />,
          "/chroot": <Chroot />,
          "/docker!": <Docker />,
          "/namespaces": <Namespaces />,
          "/cgroups": <Cgroups />,
        }}
      />
    </div>
  );
};
