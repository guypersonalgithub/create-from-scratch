import { mkdirSync, readdirSync, copyFileSync } from "fs";
import path from "path";

type CopyFolderArgs = {
  src: string;
  dest: string;
  skip?: (args: { filePath: string }) => boolean;
};

export const copyFolder = ({ src, dest, skip }: CopyFolderArgs) => {
  try {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (skip?.({ filePath: srcPath })) {
        continue;
      }

      if (entry.isDirectory()) {
        copyFolder({ src: srcPath, dest: destPath, skip });
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
