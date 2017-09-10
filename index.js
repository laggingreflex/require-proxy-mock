const Module = require('module');
const debug = require('debug')('require-automock-proxy');
// const debug = (...msg) => console.log('[require-automock-proxy]', ...msg)

const _load = Module._load;

const mocks = global.requireProxyMocks || (global.requireProxyMocks = {});
const cache = global.requireProxyMockCache || (global.requireProxyMockCache = {});

if (Module._load.name !== 'requireProxyMockPatchLoad') {
  Module._load = requireProxyMockPatchLoad;
  debug('Module._load patched');
}

function requireProxyMockPatchLoad(request, parent, isMain) {
  const debugRequest = debug.bind(debug, `[request: ${request}]`);
  // let debugRequest;
  // if (request === './.styl') {
  //   debugRequest = debug.bind(debug, `[request: ${request}]`);
  // } else {
  //   debugRequest = () => {};
  // }
  const filename = Module._resolveFilename(request, parent, isMain);

  debugRequest('Processing', filename);

  if (filename in cache) {
    debugRequest('returned from cache');
    return cache[filename];
  }

  let original, originalError;
  try {
    original = _load.call(Module, request, parent, isMain);
  } catch (error) {
    debugRequest('originalError:', error.message);
    originalError = error;
  }

  function returnOriginal() {
    if (originalError) {
      throw originalError;
    } else {
      cache[filename] = original;
      return cache[filename];
    }
  }

  function getMock() {
    debugRequest('getMock');
    if (request in mocks) {
      debugRequest('request in mocks');
      return mocks[request];
    }
    if (filename in mocks) {
      debugRequest('filename in mocks');
      return mocks[filename];
    }
    for (const req in mocks) {
      const parseRegex = req.match(/^\/(.*)\/(.*)$/);
      const regex = parseRegex
        ? new RegExp(parseRegex[1], parseRegex[2])
        : new RegExp(req);
      debugRequest('regex:', regex);
      if (filename.match(regex)) {
        debugRequest('regex matched', filename);
        return mocks[req];
      }
    }
    if (originalError) {
      throw originalError;
    }
    debugRequest('mock not found');
  };

  const initialMock = getMock();
  if (initialMock === undefined) {
    debugRequest('initialMock === undefined, so not mocking')
    return returnOriginal();
  }

  let toBeMocked = original;

  const typeofOriginal = typeof original;
  if (typeofOriginal !== 'object') {
    debugRequest(`typeof original = ${typeofOriginal}, it can't be mocked. To force mock, set a mock before requiring it.`);
    if (initialMock) {
      if (toBeMocked === undefined || typeof toBeMocked !== 'function') {
        debugRequest(`original == undefined, using: {}`);
        toBeMocked = {};
      }
    } else {
      debugRequest(`typeof original = ${typeofOriginal}, it can't be mocked. Returning original. To force mock, set a mock before requiring it.`);
      if (originalError) {
        throw originalError;
      } else {
        return returnOriginal();
      }
    }
  }

  const get = (target, key, receiver) => {
    if (typeof key !== 'string') {
      // don't mock non-string properties (like symbols or private stuff)
      return Reflect.get(target, key, receiver);
    }
    debugRequest(`<mock-proxy>[${JSON.stringify(key)}]`);
    let mock = getMock() || original || {};
    if (typeof mock[key] === 'undefined') {
      mock = original || {}
    }
    debugRequest('mock:', mock);
    let prop = Reflect.get(mock, key, receiver);
    if (typeof prop === 'function') {
      // because: http://stackoverflow.com/questions/42496414/illegal-invocation-error-using-es6-proxy-and-node-js, https://github.com/nodejs/node/issues/11629
      const org = prop;
      const bound = new Proxy(org, {
        apply(target, thisArg, args) {
          debugRequest(`<mock-proxy>[${JSON.stringify(key)}](...)`);
          return Reflect.apply(target, mock, args);
        }
      });
      prop = bound;
    }
    return prop;
  };

  try {
    const proxy = new Proxy(toBeMocked, { get });
    debugRequest('proxied', { filename });
    cache[filename] = proxy;
    return cache[filename];
  } catch (err) {
    debugRequest('proxy failed', err.message);
    return returnOriginal();
  }
}

exports.mocks = exports.mock = mocks;
