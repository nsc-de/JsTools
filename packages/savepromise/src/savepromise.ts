export default function savePromise(
  fn: () => Promise<unknown | void> | void | unknown
) {
  // True if we have a save in progress
  let saving = false;

  // True if we have a save scheduled (another save requested while saving)
  // schedule can only be true if saving is true
  let scheduled = false;

  // This promise will be resolved when the scheduled save is complete
  let promise: Promise<unknown> | undefined;

  let promiseResolve: ((value?: unknown | void) => void) | undefined,
    promiseReject: ((value?: unknown | void) => void) | undefined;

  async function do_save() {
    if (!scheduled) return;

    const rs = promiseResolve;
    const rj = promiseReject;

    promiseResolve = undefined;
    promiseReject = undefined;
    scheduled = false;
    promise = undefined;

    saving = true;

    try {
      rs?.(await fn());
    } catch (e) {
      rj?.(e);
    } finally {
      saving = false;
      if (scheduled) do_save();
    }
  }

  async function save() {
    if (scheduled) {
      return await promise;
    }

    scheduled = true;
    promise = new Promise<unknown>((rs, rj) => {
      promiseResolve = rs;
      promiseReject = rj;
    });

    if (!saving) {
      saving = true;
      do_save();
    }
  }

  return {
    get saving() {
      return saving;
    },
    get scheduled() {
      return scheduled;
    },
    get promise() {
      return promise;
    },
    save,
  };
}
