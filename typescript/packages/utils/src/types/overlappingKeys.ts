export type OverlappingKeys<A, B> = Extract<keyof A, keyof B>;
