/**
 * Create a savepromise instance
 * @param fn the function to call when saving
 * @returns a savepromise instance
 */
export default function SavePromise(
  fn: () => Promise<unknown | void> | void | unknown
) {
  // True if we have a save in progress
  let saving = false;

  // True if we have a save scheduled (another save requested while saving)
  // schedule can only be true if saving is true
  let scheduled = false;

  // This promise will be resolved when the scheduled save is complete
  let promise: Promise<unknown> | undefined;

  // These will be set when a save is scheduled
  let promiseResolve: ((value?: unknown | void) => void) | undefined,
    promiseReject: ((value?: unknown | void) => void) | undefined;

  // this function does the actual saving
  async function do_save() {
    // If we're not scheduled, we're done
    if (!scheduled) return;

    // Copy the resolve and reject functions to local variables
    const rs = promiseResolve;
    const rj = promiseReject;

    // Clear the scheduled flag
    promiseResolve = undefined;
    promiseReject = undefined;
    scheduled = false;
    promise = undefined;

    // Set the saving flag
    saving = true;

    try {
      const result = await fn();
      rs?.(result);
    } catch (e) {
      rj?.(e);
    } finally {
      saving = false;
      if (scheduled) do_save();
    }
  }

  /**
   * Save the data
   * @returns A promise that will be resolved when the save is complete
   */
  async function save() {
    if (scheduled) {
      return await promise;
    }

    scheduled = true;
    const p = (promise = new Promise<unknown>((rs, rj) => {
      promiseResolve = rs;
      promiseReject = rj;
    }));

    if (!saving) {
      saving = true;
      do_save();
    }

    const result = await p;

    return result;
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

export type SavePromise = ReturnType<typeof SavePromise>;
export { SavePromise };
