"use strict";

function timeout(timeout) {
  let timer, rs, rj;
  function stop() {
    clearTimeout(timer);
  }

  const promise = new Promise((resolve, reject) => {
    rj = reject;
    rs = resolve;
    timer = setTimeout(() => {
      resolve();
    }, timeout);
  });

  promise.stop = stop;
  promise.resolve = function (arg) {
    stop();
    rs(arg);
  };
  promise.reject = function (arg) {
    stop();
    rj(arg);
  };

  return promise;
}

module.exports = timeout;
module.exports.default = timeout;
module.exports.timeout = timeout;
