export type DockerComposeData = {
  services: {
    [service: string]: DockerService;
  };
  volumes: Record<string, DockerVolume>;
  networks: Record<string, DockerNetwork>;
};

type DockerService = {
  image: string;
  environment: string[];
  build?: { dockerfile: string; context: string; target: string };
  profiles: string[];
  init?: boolean;
  restart?: string;
  volumes: DockerContainerVolume[];
  networks: string[];
  ports: string[];
  depends_on?: string[];
};

type DockerContainerVolume = {
  type: string;
  source?: string;
  target: string;
};

type DockerVolume = {
  external: boolean;
};

type DockerNetwork = {
  name: string;
};

export type WorkspaceContainerProperties = Record<
  string,
  Pick<DockerService, "image" | "environment" | "volumes" | "networks" | "ports"> & {
    dependsOn: Pick<DockerService, "depends_on">["depends_on"];
    files?: string[];
    target?: string;
    dependencies?: string[];
    devDependencies?: string[];
    peerDependencies?: string[];
    scripts?: Record<string, string>;
    restart?: string;
    startCommandDev?: string[];
    startCommandProd?: string[];
    skip?: string[];
  }
>;

export type Profiles = Set<string>;
