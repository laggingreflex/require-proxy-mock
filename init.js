const patchedModuleLoad = require('./patched-module-load');

const _load = Symbol(`Original _load patched by require-proxy-mock`);

module.exports = () => {
  const Module = require('module');

  if (Module[_load]) return;
  Module[_load] = Module._load;

  Module._load = function requireProxyMockPatchLoad() {
    const org = () => Module[_load].apply(this, arguments);
    return patchedModuleLoad(org).apply(this, arguments);
  }
}
