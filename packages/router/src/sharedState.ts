import { Observer } from "@packages/design-patterns";

export const sharedState = new Observer<Record<string, string>>({});
