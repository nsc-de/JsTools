# prtimeout

A simple timeout library for nodejs. It gives an promise based alternative to setTimeout and clearTimeout.

## Installation

```bash
npm install prtimeout
```

## Usage

```javascript
const timeout = require("prtimeout");

await timeout(100); // waits 100ms
```
