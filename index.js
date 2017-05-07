const Module = require('module');

const _load = Module._load;
Module._load = requireProxyMockPatchLoad;

const mocks = module.exports = global.requireProxyMocks = global.requireProxyMocks || {};

function requireProxyMockPatchLoad(request) {
  const original = _load.apply(Module, arguments);

  if (typeof original !== 'object') {
    return original;
  }

  return new Proxy(original, {
    apply(original, _this, _args) {
      const fn = mocks[request] || original;
      return fn.apply(_this, _args);
    },
    construct(original, _args) {
      const cn = mocks[request] || original;
      return new(cn.bind.apply(cn, _args));
    },
    get(original, name) {
      return mocks[request] && mocks[request][name] || original[name];
    },
    set(original, prop, value) {
      original[prop] = value;
      return true;
    }
  });
}
