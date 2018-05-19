const Module = require('module');
const handle = require('./handle');
const { getMock } = require('./utils');

const _load = Module._load;
Module._load = requireProxyMockPatchLoad;

const cache = {};

function requireProxyMockPatchLoad(request, parent, isMain) {

  const filename = Module._resolveFilename(request, parent, isMain);

  if (cache[filename]) {
    return cache[filename];
  }

  if (filename.match(/source-map-support/)) {
    console.log('Prevented source-map-support');
    return {};
  }

  let original, originalError;
  try {
    original = _load.apply(Module, arguments);
  } catch (error) {
    originalError = error;
    const mock = getMock({ request, filename });
    if (mock) {
      original = mock;
    } else {
      throw error;
    }
  }

  const type = typeof original;

  if ([
      'string',
      'number',
      'boolean',
      'symbol'
    ].indexOf(type) > -1) {
    // can't mock primitives
    return original;
  }

  const getMockThis = () => getMock({ request, filename, original, originalError });

  const proxy = handle[type]({ request, filename, original, originalError, getMock: getMockThis });

  cache[filename] = proxy;

  return proxy;
}
