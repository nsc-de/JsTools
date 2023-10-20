# PTimeout

A simple timeout library for nodejs. It gives an promise based alternative to setTimeout and clearTimeout.

## Installation

```bash
npm install ptimeout
```

## Usage

```javascript
const timeout = require("ptimeout");

await timeout(100); // waits 100ms
```
