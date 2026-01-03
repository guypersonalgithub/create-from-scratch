import { useState } from "react";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type ImageViewerProps = {
  className?: string;
  src: string;
  alt?: string;
};

export const ImageViewer = ({ className, src, alt }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(1);

  return (
    <img
      className={combineStringsWithSpaces(
        dynatic`
            transition: transform 0.2s;
            cursor: zoom-in;
        `,
        className,
      )}
      src={src}
      alt={alt}
      style={{
        transform: `scale(${zoom})`,
      }}
      onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
    />
  );
};
