type CopyComputedStylesArgs = {
  source: HTMLElement;
  target: HTMLElement;
};

export const copyComputedStyles = ({ source, target }: CopyComputedStylesArgs) => {
  const sourceComputedStyles = window.getComputedStyle(source);
  for (const key of sourceComputedStyles) {
    try {
      target.style.setProperty(key, sourceComputedStyles.getPropertyValue(key));
    } catch {
      // some properties may be read-only or invalid
    }
  }

  // const rect = source.getBoundingClientRect();
  // target.style.width = `${rect.width}px`;
  // target.style.height = `${rect.height}px`;
};
