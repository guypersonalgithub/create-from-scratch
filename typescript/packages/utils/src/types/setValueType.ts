export type SetValueType<T> = T extends Set<infer U> ? U : never;
