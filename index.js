const Module = require('module');

const _load = Module._load;
Module._load = requireProxyMockPatchLoad;

const mocks = module.exports = global.requireProxyMocks = global.requireProxyMocks || {};

function requireProxyMockPatchLoad(request) {
  let original, originalError;
  try {
    original = _load.apply(Module, arguments);
  } catch (error) {
    originalError = error;
  }

  function getMock() {
    let mock;
    mock = mocks[request];
    if (typeof mock !== 'undefined') {
      return mock;
    }
    for (const req in mocks) {
      let regex;
      const parseRegex = req.match(/^\/(.*)\/(.*)$/);
      if (parseRegex) {
        regex = new RegExp(parseRegex[1], parseRegex[2]);
      } else {
        regex = new RegExp(req);
      }
      mock = mocks[req];
      if (request.match(regex)) {
        return mock;
      }
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
      return new(cn.bind.apply(cn, _args));
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
