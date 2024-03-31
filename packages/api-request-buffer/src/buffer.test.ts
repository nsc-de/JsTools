import { ApiRequestBuffer } from "./buffer";

jest.useFakeTimers();

describe("ApiRequestBuffer", () => {
  // Mock requestMultiple function
  const mockRequestMultiple = jest.fn();
  // Mock max batch size and max batch wait time
  const maxBatchSize = 3;
  const maxBatchWaitTime = 1000; // 1 second

  let buffer: ApiRequestBuffer<number, number>;
  jest.spyOn(global, "setTimeout");

  beforeEach(() => {
    mockRequestMultiple.mockClear();
    buffer = new ApiRequestBuffer(
      "test-buffer",
      mockRequestMultiple,
      maxBatchSize,
      maxBatchWaitTime
    );
  });

  describe("request", () => {
    it("should buffer the request and resolve it when flushed", async () => {
      // Mock requestMultiple to resolve with provided output
      mockRequestMultiple.mockResolvedValue([10]);

      const promise = buffer.request(5);

      // No request should be made yet
      expect(mockRequestMultiple).not.toHaveBeenCalled();

      // Resolve the promise
      buffer.flush();

      // Now, a request should be made
      expect(mockRequestMultiple).toHaveBeenCalledTimes(1);

      // Check if the resolved value is correct
      expect(await promise).toBe(10);
    });

    it("should reject the request if requestMultiple fails", async () => {
      // Mock requestMultiple to reject
      mockRequestMultiple.mockRejectedValue(new Error("Request failed"));

      const promise = buffer.request(5);

      buffer.flush();

      // Reject the promise
      await expect(promise).rejects.toThrow("Request failed");
    });
  });

  describe("buffer behavior", () => {
    it("should flush buffer when it reaches maxBatchSize", async () => {
      // Mock requestMultiple to resolve with provided output
      mockRequestMultiple.mockResolvedValue([10, 20, 30]);

      // Send requests more than maxBatchSize
      const promises = [buffer.request(5), buffer.request(10)];

      // No request should be made yet
      expect(mockRequestMultiple).not.toHaveBeenCalled();

      promises.push(buffer.request(15));

      // Now, a request should be made
      expect(mockRequestMultiple).toHaveBeenCalledTimes(1);

      // Check if the resolved values are correct
      await expect(promises[0]).resolves.toBe(10);
      await expect(promises[1]).resolves.toBe(20);
      await expect(promises[2]).resolves.toBe(30);
    });

    it("should flush buffer when maxBatchWaitTime elapses", async () => {
      // Mock requestMultiple to resolve with provided output
      mockRequestMultiple.mockResolvedValue([10, 20, 30]);

      // Send a request
      const promise = buffer.request(5);

      // No request should be made yet
      expect(mockRequestMultiple).not.toHaveBeenCalled();

      // Wait for maxBatchWaitTime
      jest.advanceTimersByTime(maxBatchWaitTime);

      // Now, a request should be made
      expect(mockRequestMultiple).toHaveBeenCalledTimes(1);

      // Check if the resolved value is correct
      await expect(promise).resolves.toBe(10);
    });

    it("should schedule buffer cleaner only once", async () => {
      // Send requests such that buffer length exceeds maxBatchSize
      buffer.request(5);
      buffer.request(10);

      // Buffer cleaner should be scheduled
      expect(setTimeout).toHaveBeenCalledTimes(1);

      // Send another request
      await buffer.request(20);

      // Buffer cleaner should not be scheduled again
      expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it("should flush buffer on buffer cleaner timeout", async () => {
      // Mock requestMultiple to resolve with provided output
      mockRequestMultiple.mockResolvedValue([10, 20, 30]);

      // Send requests such that buffer length exceeds maxBatchSize
      buffer.request(5);
      buffer.request(10);

      // Buffer cleaner should be scheduled
      expect(setTimeout).toHaveBeenCalledTimes(1);

      // Wait for buffer cleaner timeout
      jest.advanceTimersByTime(maxBatchWaitTime);

      // Now, a request should be made
      expect(mockRequestMultiple).toHaveBeenCalledTimes(1);
    });
  });

  describe("requestAll", () => {
    it("should send all requests in a batch", async () => {
      // Mock requestMultiple to resolve with provided output
      mockRequestMultiple.mockResolvedValue([10, 20]);

      const promises = buffer.requestAll([5, 10]);

      // No request should be made yet
      expect(mockRequestMultiple).not.toHaveBeenCalled();

      // Resolve the promise
      buffer.flush();

      // Now, a request should be made
      expect(mockRequestMultiple).toHaveBeenCalledTimes(1);

      // Check if the resolved values are correct
      await expect(promises).resolves.toEqual([10, 20]);
    });
  });
});
