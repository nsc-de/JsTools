const path = require("path");
const fs = require("fs");

module.exports = function (p) {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(p, "./package.json"), "utf8"),
  );

  const name = packageJson.name;

  /** @type {import('typedoc').TypeDocOptions} */
  const options = {
    entryPoints: [path.resolve(p, "./src/index.ts")],
    out: path.resolve(
      __dirname,
      "../docs/static/docs/api-reference/",
      `${name}`,
    ),
    tsconfig: path.resolve(p, "./tsconfig.json"),
    // includeDeclarations: true,
    externalPattern: "node_modules/",
    exclude: ["node_modules"],
    excludeExternals: false,
    sourceLinkTemplate: `https://github.com/nsc-de/JsTools/tree/{gitRevision}/{path}#L{line}`,
    includeVersion: true,
    excludeInternal: true,
    skipErrorChecking: true,
  };

  return options;
};
