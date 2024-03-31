import debug from "debug";

/**
 * Debug logger for buffer api
 */
const log = debug("buffer");

/**
 * An entry for the buffer
 * @author Nicolas Schmidt
 */
export interface BufferEntry<I, O> {
  /**
   * The input to request
   */
  input: I;

  /**
   * Resolve function of the promise
   */
  resolve: (output: O) => void;

  /**
   * Reject function of the promise
   */
  reject: (error: unknown) => void;
}

/**
 * Buffer for api requests
 *
 * @example
 * const buffer = new ApiRequestBuffer(new DataRequestBuffer(
 *   "<name of the buffer>",
 *   async (list) => {
 *     // Fetch data from the server (gets a list of stuff to fetch, for example a list of ids)
 *   });
 *   50, // The maximum number of requests to send in a batch
 *   1000, // The maximum time to wait before sending a batch (in milliseconds)
 * );
 *
 * buffer.request("id1");
 * buffer.request("id2");
 * buffer.request("id3");
 *
 * // if you want to send the requests immediately
 * buffer.flush();
 *
 * @author Nicolas Schmidt
 */
export class ApiRequestBuffer<I, O> {
  /**
   * The internal buffer
   * @internal
   */
  private readonly buffer: BufferEntry<I, O>[] = [];

  /**
   * The buffer cleaner function
   * @internal
   */
  private readonly bufferCleanerFunction: () => void = () => {
    if (this.buffer.length > 0) this.flush();
  };

  /**
   * The buffer cleaner timeout
   * @internal
   */
  private bufferCleanerTimeout?: NodeJS.Timeout;

  /**
   * Creates a new buffer
   * @param name the name of the buffer
   * @param requestMultiple the function to request multiple items
   * @param maxBatchSize the maximum number of requests to send in a batch
   * @param maxBatchWaitTime the maximum time to wait before sending a batch (in milliseconds)
   */
  constructor(
    /**
     * The name of the buffer
     */
    public readonly name: string,

    /**
     * The function to request multiple items
     */
    private readonly requestMultiple: (
      requests: I[],
    ) => Promise<(O | Promise<O>)[]>,

    /**
     * The maximum number of requests to send in a batch
     */
    private readonly maxBatchSize: number,

    /**
     * The maximum time to wait before sending a batch (in milliseconds)
     */
    private readonly maxBatchWaitTime: number,
  ) {}

  /**
   * Flushes the buffer
   */
  public async flush() {
    log.extend("flush")(
      `Flushing buffer for ${this.name} with ${this.buffer.length} entries`,
    );

    while (this.buffer.length > 0) {
      log.extend("flush")(
        `Flushing ${this.maxBatchSize} entries from buffer for ${this.name}`,
      );
      const buffer = this.buffer.splice(
        0,
        Math.min(this.maxBatchSize, this.buffer.length),
      );
      const inputs = buffer.map((entry) => entry.input);

      try {
        const outputs = await this.requestMultiple(inputs);
        buffer.forEach(async (entry, index) => {
          entry.resolve(await outputs[index]);
        });
      } catch (error) {
        buffer.forEach((entry) => {
          entry.reject(
            new Error(
              `Error occurred in buffer "${this.name}"
              input-length: ${inputs.length} 
              max-batch-size: ${this.maxBatchSize}
              inputs: ${inputs}
              error: ${(error as Error)?.stack ?? error}`,
            ),
          );
        });
      }
    }

    if (this.bufferCleanerTimeout) clearTimeout(this.bufferCleanerTimeout);
    this.bufferCleanerTimeout = undefined;
  }

  /**
   * Checks the buffer (potentially flushing it if it is full)
   * @internal
   */
  private async checkBuffer() {
    if (this.buffer.length >= this.maxBatchSize) {
      log.extend("autoflush")(
        `Buffer for ${this.name} reached maxBatchSize of ${this.maxBatchSize}`,
      );
      await this.flush();
    } else {
      this.checkBufferCleaner();
    }
  }

  /**
   * Schedules the buffer cleaner
   * @internal
   */
  private scheduleBufferCleaner() {
    log.extend("schedule")(
      `Scheduling buffer cleaner for ${this.name} in ${this.maxBatchWaitTime}ms`,
    );
    this.bufferCleanerTimeout = setTimeout(
      this.bufferCleanerFunction,
      this.maxBatchWaitTime,
    );
  }

  /**
   * Checks the buffer cleaner
   * @internal
   */
  private checkBufferCleaner() {
    if (!this.bufferCleanerTimeout) this.scheduleBufferCleaner();
  }

  /**
   * Requests an item
   * @param input the input to request
   * @returns the output of the request
   */
  public async request(input: I): Promise<O> {
    log.extend("requests")(`Received request for ${this.name}: ${input}`);

    return new Promise((resolve, reject) => {
      this.buffer.push({ input, resolve, reject });
      this.checkBuffer();
    });
  }

  /**
   * Requests multiple items
   * @param inputs the inputs to request
   * @returns the outputs of the requests
   */
  public async requestAll(inputs: I[]): Promise<O[]> {
    return Promise.all(inputs.map((input) => this.request(input)));
  }
}

export default ApiRequestBuffer;
