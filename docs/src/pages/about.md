# About JsTools

My name is Nicolas Schmidt [[GitHub: @nsc-de]](https://github.com/nsc-de), im a Student / Developer from Darmstadt
Germany. Im coding ~10 years and I've created a few js open-source packages and tools on different GH/NPM accounts.

This repository is a storage for tools that are to small for it's own repository. They are often created alongside
other projects. It is a lot of effort to prepare everything in a repo to have a good publish toolchain every time,
so i decided to create this monorepo for all my small js utilities. Its automated using a powerful combination of
turborepo and changeset, so it is not a huge effort to support the growing amount of packages in the long term and
keep them updated with bugfixes, patches, dependency fixes and new versions of node/javascript.

## Quality

All packages in this repository are very small, unit tested using jest and meet security requirements. Any request
can be issued via the github issure tracker. Please address any security related requests directly to [contact@nscde.com](mailto:contact@nscde.com).

## Toolchain

_We use the folloing tools_

### Testing

- [jest](https://jestjs.io/) for testing

### Dependenies

- [npm](https://www.npmjs.com/) for dependency management

### Development / Building

#### Compilation Flow

- [typescript](https://www.typescriptlang.org/) as main development language
- [babel](https://babeljs.io/) for compiling the code

#### Manual Flow

_The compilation flow creates some overhead code. For huge Libraries this is no big deal. 96KB vs 97KB is no big
difference. But for very small libraries, this does matter a lot. 1KB and 2KB is a big difference. So some of our
the smaller libraries are written in plain js with manually written types._

### Management

_Additionally we use the following tools for managing the project_

- [TurboRepo](https://turbo.build/) to manage the monorepo
- [Changesets](https://github.com/changesets/changesets) to manage our package versioning
- [GitHub](https://github.com/) to manage our repository
- [GitHub Actions](https://docs.github.com/de/actions) to automate our repository

### Documentation

- [GitHub Pages](https://pages.github.com/) to host our website
- [Docusaurus](https://docusaurus.io/) to build our documentation website
- [TypeDoc](https://typedoc.org/) to build documentation from typescript docstrings
