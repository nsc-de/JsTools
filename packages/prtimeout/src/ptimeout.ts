export type Timeout = Promise<void> & {
  stop(): void;
  resolve(arg?: unknown): void;
  reject(arg?: unknown): void;
};

export default function timeout(timeout: number) {
  let timer: NodeJS.Timeout;
  let rj: (reason?: unknown) => void;
  let rs: (value?: unknown) => void;

  function stop() {
    clearTimeout(timer);
  }

  const promise = new Promise<void>((resolve, reject) => {
    rj = reject;
    rs = resolve as (value?: unknown) => void;
    timer = setTimeout(() => {
      resolve();
    }, timeout);
  }) as Timeout;

  promise.stop = stop;
  promise.resolve = function (arg?: unknown) {
    stop();
    rs(arg as unknown);
  };
  promise.reject = function (arg?: unknown) {
    stop();
    rj(arg);
  };

  return promise;
}

export { timeout };
