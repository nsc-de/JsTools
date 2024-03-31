# Request Rate Clock

This package provides a clock that can be used to limit the rate of requests to a server. It is useful for rate limiting requests to a server, for example to prevent a server from being overwhelmed by too many requests or using rate-limited APIs like the GitHub API, Spotify API, etc.

## Installation

```bash
npm install request-rate-clock
```

## Usage

```javascript
import RateClock from "request-rate-clock";

const clock = RateClock.create(5, 1000); // Allow 5 requests per second

(async () => {
  for (let i = 0; i < 1000; i++) {
    await clock.acquire();
    console.log("Request", i + 1);
  }
})().catch(console.error);
```

## API

### `RateClock.create(rate: number, interval: number): RateClock`
