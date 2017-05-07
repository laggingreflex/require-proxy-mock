const Module = require('module');

const _load = Module._load;
Module._load = requireProxyMock;

const isGhost = global.requireProxyMockIsGhostSymbol = global.requireProxyMockIsGhostSymbol || Symbol('requireProxyMockIsGhostSymbol');

const mocks = module.exports = global.requireProxyMocks = global.requireProxyMocks || new Proxy({}, {
  get(mocks, request) {
    if (request === 'default') {
      return mocks;
    } else if (request === '__esModule') {
      return true;
    } else if (request === 'isGhost') {
      return isGhost;
    } else {
      return mocks[request] || (mocks[request] = {
        [isGhost]: true
      })
    }
  },
});

function requireProxyMock(request) {
  const original = _load.apply(Module, arguments);

  if (typeof original !== 'object') {
    return original;
  }

  if (request === 'require-proxy-mock') {
    return original;
  }

  const getMock = () => {
    const mock = mocks[request];
    if (mock && !mock[isGhost]) {
      return mock;
    } else {
      return original;
    }
  }

  return new Proxy(original, {
    apply(original, _this, _args) {
      const fn = getMock();
      return fn.apply(_this, _args);
    },
    construct(original, _args) {
      const cn = getMock();
      return new(cn.bind.apply(cn, _args));
    },
    get(original, name) {
      return mocks[request] && mocks[request][name] || original[name];
    },
  });
}
