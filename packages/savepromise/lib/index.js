function SavePromise(fn) {
  let saving = false;
  let scheduled = false;
  let promise;
  let promiseResolve, promiseReject;

  async function do_save() {
    if (!scheduled) return;
    const rs = promiseResolve;
    const rj = promiseReject;
    promiseResolve = promiseReject = promise = undefined;
    scheduled = false;
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

  async function save() {
    if (scheduled) {
      return await promise;
    }

    scheduled = true;
    const p = (promise = new Promise((rs, rj) => {
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

module.exports = SavePromise;
module.exports.default = SavePromise;
module.exports.SavePromise = SavePromise;
