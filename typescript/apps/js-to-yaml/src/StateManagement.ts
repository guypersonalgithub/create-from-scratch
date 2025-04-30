import { Anchor } from "@packages/scrollspy-anchors";
import { stateManagement, useStateManagement, useComplexStateManagement } from "@packages/state-management";

export const { getData, stateUpdates, fullSubscribe } = stateManagement({
  initialState: { documentationAnchors: [] as Anchor[] },
  stateUpdates: {
    updateAnchors: (_, anchors: Anchor[]) => {
      return {
        documentationAnchors: anchors,
      };
    },
  },
});
export const useSharedState = <T>(selector: (data: ReturnType<typeof getData>) => T) =>
  useStateManagement({ fullSubscribe, getData, selector });

export const useComplexSharedState = <T>(selector: (data: ReturnType<typeof getData>) => T) =>
  useComplexStateManagement({ fullSubscribe, getData, selector });