// export type ExtractRouterPaths<T extends RouterPaths, Prefix extends string = ""> = {
//   [K in keyof T & `/${string}`]: T[K] extends RouterPathGuard
//     ? `${Prefix}${K}` extends `${infer Base}/`
//       ? // Exclude redundant trailing `/` if there's nothing after it
//         Prefix extends ""
//         ?
//             | ExtractRouterPaths<
//                 ReturnType<T[K]> extends RouterPaths ? ReturnType<T[K]> : {},
//                 `${Base}`
//               >
//             | `${Base}`
//         : never
//       :
//           | ExtractRouterPaths<
//               ReturnType<T[K]> extends RouterPaths ? ReturnType<T[K]> : {},
//               `${Prefix}${K}`
//             >
//           | `${Prefix}${K}`
//     : T[K] extends React.ReactElement
//       ? `${Prefix}${K}` extends `${infer Base}/`
//         ? `${Base}`
//         : `${Prefix}${K}`
//       : T[K] extends RouterPaths
//         ? `${Prefix}${K}` extends `${infer Base}/`
//           ? ExtractRouterPaths<T[K], `${Base}`> | `${Base}`
//           : ExtractRouterPaths<T[K], `${Prefix}${K}`> | `${Prefix}${K}`
//         : never;
// }[keyof T & `/${string}`];

import { RouterPaths } from "./types";

type IsLeaf = ((props?: any) => React.ReactNode) | React.ReactNode;

type TransformPathSegment<S extends string, Prefix extends string = ""> = S extends "/"
  ? never
  : S extends `/:${infer Param}` // Preserve dynamic segments
    ? `${Prefix}${Param extends "" ? "" : `/:${Param}`}`
    : S extends `${string}/*` // Convert wildcards to dynamic segments
      ? `/ ${string}`
      : S; // Static paths remain unchanged

export type ExtractRouterPaths<T extends RouterPaths, Prefix extends string = ""> = {
  [K in keyof T & `/${string}`]: T[K] extends IsLeaf
    ? `${Prefix}${TransformPathSegment<K, Prefix>}`
    : T[K] extends RouterPaths
      ?
          | ExtractRouterPaths<T[K], `${Prefix}${TransformPathSegment<K, Prefix>}`>
          | `${Prefix}${TransformPathSegment<K, Prefix>}`
      : never;
}[keyof T & `/${string}`];

export type AllPaths = (string & {}) | ExtractRouterPaths<RouterPaths>;

type TransformIfContainsDynamic<S extends string> =
  S extends `${infer Prefix}/:${infer Param}/${infer Rest}` // Dynamic path with further segments
    ? `${Prefix}/${string}/${TransformIfContainsDynamic<Rest>}` // Transform and recurse
    : S extends `${infer Prefix}/:${infer Param}` // Dynamic path without further segments
      ? `${Prefix}/${string}` // Transform the last segment
      : S; // No dynamic segments, keep as is

// Testing with a union of strings
type Example = TransformIfContainsDynamic<"/user/:id" | "/home" | "/product/:productId/details">;
// Result: "/user/${string}" | "/home" | "/product/${string}/details"
