type SizeToPixelsArgs = {
  size: string;
  fontSize?: number; // for rem/em
  parentSize?: number; // for %
  viewportHeight?: number; // for vh
  viewportWidth?: number; // for vw
};

// parseFloat(getComputedStyle(element).fontSize);

export const sizeToPixels = ({
  size,
  fontSize = 16,
  parentSize = 100,
  viewportWidth = window.innerWidth,
  viewportHeight = window.innerHeight,
}: SizeToPixelsArgs) => {
  if (size.endsWith("px")) {
    return parseFloat(size);
  }
  if (size.endsWith("rem")) {
    return parseFloat(size) * fontSize;
  }
  if (size.endsWith("em")) {
    return parseFloat(size) * fontSize;
  }
  if (size.endsWith("%")) {
    return (parseFloat(size) / 100) * parentSize;
  }
  if (size.endsWith("vw")) {
    return (parseFloat(size) / 100) * viewportWidth;
  }
  if (size.endsWith("vh")) {
    return (parseFloat(size) / 100) * viewportHeight;
  }

  // Fallback — assume pixels if unitless
  const value = parseFloat(size);
  if (isNaN(value)) {
    return;
  }

  return value;
};
