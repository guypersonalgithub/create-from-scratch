import { spawn } from "child_process";

spawn("vite", ["--host"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: "--import tsx",
  },
});
