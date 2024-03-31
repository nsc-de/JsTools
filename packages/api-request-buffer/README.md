# Api Request Buffer

This package is used to buffer api requests and send them in batches to the server. It is useful when you have a lot of requests to send and you want to reduce the number of requests to the server. For example, if you request a list of tracks from spotify web api, you can buffer the requests and send them in batches to reduce the number of requests to the server. This is especially useful when you are working with a rate limited api.

## Installation

```bash
npm install api-request-buffer
```

## Usage

```javascript
import ApiRequestBuffer from 'api-request-buffer';

const buffer = new ApiRequestBuffer(new DataRequestBuffer(
  "<name of the buffer>",
  async (list) => {
    // Fetch data from the server (gets a list of stuff to fetch, for example a list of ids)
  });
  50, // The maximum number of requests to send in a batch
  1000, // The maximum time to wait before sending a batch (in milliseconds)
);

buffer.request("id1");
buffer.request("id2");
buffer.request("id3");

// if you want to send the requests immediately
buffer.flush();
```

## License

This package is licensed under the [BSD-3-Clause License](https://github.com/nsc-de/JsTools/blob/master/LICENSE)

