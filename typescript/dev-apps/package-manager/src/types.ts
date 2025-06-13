export type ParsedData = {
  name: string;
  instances: {
    path: string;
    version: string;
    belongsTo: string;
    dependencyType: string;
  }[];
  isLocal: boolean;
}[];
