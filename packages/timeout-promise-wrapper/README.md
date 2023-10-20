# timeout-promise-wrapper

A simple timeout library for nodejs. It gives an promise based alternative to setTimeout and clearTimeout.

## Installation

```bash
npm install timeout-promise-wrapper
```

## Usage

```javascript
const timeout = require("timeout-promise-wrapper");

await timeout(100); // waits 100ms
```
