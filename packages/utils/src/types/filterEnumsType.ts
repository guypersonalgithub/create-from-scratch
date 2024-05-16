export type FilterEnums<T, U extends T> = T extends U ? never : T;
