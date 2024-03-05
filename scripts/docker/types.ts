export type dockerComposeData = {
  services: {
    [service: string]: DockerService;
  };
  networks: Record<string, DockerNetwork>;
};

type DockerService = {
  image: string;
  environment: string[];
  build: { dockerfile: string; context: string; target: string };
  profiles: string[];
  init: boolean;
  volumes: DockerVolume[];
  networks: string[];
  ports: string[];
};

type DockerVolume = {
  type: string;
  source?: string;
  target: string;
};

type DockerNetwork = {
  name: string;
};

export type workspaceContainerProperties = Pick<
  DockerService,
  "environment" | "volumes" | "networks" | "ports"
>;
