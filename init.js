const mocks = require('./mocks');

const flag = Symbol('patched');

module.exports = () => {
  const Module = require('module');

  if (Module[flag]) return;

  const _load = Module._load;
  Module._load = requireProxyMockPatchLoad;

  Module[flag] = true;

  function requireProxyMockPatchLoad(request) {
    if (['require-proxy-mock'].includes(request)) return _load.apply(Module, arguments);
    let original, originalError;
    if (getMock()) {
      try {
        original = _load.apply(Module, arguments);
      } catch (error) {
        originalError = error;
      }
    } else {
      original = _load.apply(Module, arguments);
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
      construct(original, _args) {
        const cn = getMock();
        return Reflect.construct(cn, _args);
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

}
