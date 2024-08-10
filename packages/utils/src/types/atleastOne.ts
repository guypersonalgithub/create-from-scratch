export type AtleastOne<T, K extends keyof T = keyof T> = 
  K extends keyof T 
  ? Required<Pick<T, K>> & Partial<Omit<T, K>>
  : never;