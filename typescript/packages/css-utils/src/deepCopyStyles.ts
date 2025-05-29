import { copyComputedStyles } from "./copyComputedStyles";

type DeepCopyStylesArgs = {
  source: HTMLElement;
  target: HTMLElement;
};

export const deepCopyStyles = ({ source, target }: DeepCopyStylesArgs) => {
  copyComputedStyles({ source, target });
  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  for (let i = 0; i < sourceChildren.length; i++) {
    if (sourceChildren[i] instanceof HTMLElement && targetChildren[i] instanceof HTMLElement) {
      deepCopyStyles({
        source: sourceChildren[i] as HTMLElement,
        target: targetChildren[i] as HTMLElement,
      });
    }
  }
};
