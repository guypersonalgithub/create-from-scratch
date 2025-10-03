export type Callback = {
  input: string;
  currentIndex: number;
  newTokenValue: string;
  imports: Imports;
  includeTypes?: boolean;
};

export type ExportProperties = {
  name: string;
  rename?: string;
};

export type Imports = Record<
  string,
  {
    exportDefault?: Set<string>; // Set incase for some reason the same file is imported twice with different names in the same file.
    as?: Set<string>; // Set incase for some reason the same file is imported twice with different names in the same file.
    exports?: ExportProperties[];
    takenExports?: Set<string>;
  }
>;
