import { getProjectAbsolutePath } from "@packages/paths";
import { readdirSync, readFileSync } from "fs";

type DetectUndevelopedLocalPackagesArgs = {
  folders?: string[];
};

export const detectUndevelopedLocalPackages = ({
  folders = ["packages", "dev-packages"],
}: DetectUndevelopedLocalPackagesArgs) => {
  const absolutePath = getProjectAbsolutePath();

  folders.forEach((folder) => {
    const folderPath = `${absolutePath}/${folder}`;
    const folders = readdirSync(folderPath, { withFileTypes: true });
    folders.forEach((folder) => {
      const packagePath = `${folderPath}/${folder.name}`;
      const indexPath = `${packagePath}/src/index.ts`;
      const file = readFileSync(indexPath, "utf-8");
      if (file.length === 0) {
        console.log(packagePath);
      }
    });
  });
};
