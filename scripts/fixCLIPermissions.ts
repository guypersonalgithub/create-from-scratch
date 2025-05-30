import { chmodSync, existsSync, statSync } from "fs";
import { join } from "path";

// List of files you want to make executable
const filesToMakeExecutable = ["./typescript/clis/index.js"];

filesToMakeExecutable.forEach((filePath) => {
  const absPath = join(process.cwd(), filePath);

  if (!existsSync(absPath)) {
    console.log(`⏭️  Skipping: ${filePath} does not exist`);
    return;
  }

  const stats = statSync(absPath);

  // Check if it's already executable by the owner
  const isExecutable = (stats.mode & 0o100) > 0;

  if (!isExecutable) {
    chmodSync(absPath, stats.mode | 0o755); // Give owner execute permission
    console.log(`✅ Made executable: ${filePath}`);
  } else {
    console.log(`✔️ Already executable: ${filePath}`);
  }
});
