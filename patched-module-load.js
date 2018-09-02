const mocks = require('./mocks');

module.exports = org => request => {

  const console = new Proxy(global.console, { get: (t, l) => (...m) => [''].find(_ => request.match(_) && global.console[l](...m)) })

  if (['require-proxy-mock'].includes(request)) return org();
  let original, originalError;
  if (getMock()) {
    try {
      original = org();
    } catch (error) {
      originalError = error;
    }
  } else {
    original = org();
  }

  function getMock() {
    if (mocks.has(request)) {
      return mocks.get(request);
    }
    for (const [req, mock] of mocks) {
      if (!(req instanceof RegExp)) continue;
      if (req.test(request)) return mock;
    }
    if (originalError) {
      throw originalError;
    } else {
      return original;
    }
  }

  if (['string',
      'number',
      'boolean',
      'symbol'
    ].indexOf(typeof original) > -1) {
    // can't mock primitives
    return original;
  }

  return new Proxy(original || {}, {
    apply(original, _this, _args) {
      const fn = getMock();
      return fn.apply(_this, _args);
    },
    construct(original, _args, recv) {
      const cn = getMock();
      return Reflect.construct(cn, _args, recv);
    },
    get(original, name) {
      const obj = getMock();
      const mockedProp = obj[name];
      if (typeof mockedProp !== 'undefined') {
        return mockedProp;
      } else {
        return original[name];
      }
    },
  });
}
