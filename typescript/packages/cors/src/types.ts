export type CORSOptions = {
  origin?: string | ((origin: string | undefined) => string | undefined);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
};
