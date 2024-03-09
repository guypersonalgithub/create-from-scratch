#!/usr/bin/env node
require("ts-node").register({
  projectSearchDir: __dirname, // tell ts-node where to find our local tsconfig.json and local typescript version
});
require("./auto-generate"); // now that ts-node has been installed, our code will compile

// ===================================================================================================================================================
// This file serves as the entry point of the CLI. The shebang is based off the base node interpreter,
// as basing it off typescript would require more complex configurations that I would like to avoid.
// By requiring ts-node, registering the project search directory and requiring the typescript entry point, we can have our CLI work with typescript
// without having to constantly rebuild the code on changes, which is more ideal as we don't care as much about typing overhead in local development.
// ===================================================================================================================================================
