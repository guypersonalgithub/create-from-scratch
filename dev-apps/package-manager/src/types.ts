type ParsedData = {
  name: string;
  instances: {
    path: string;
    version: string;
    belongsTo: string;
    dependencyType: string;
  }[];
  isLocal: boolean;
}[];

export type Data = ParsedData[number][];
