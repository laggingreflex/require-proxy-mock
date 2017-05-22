/**
 * Can't mock object.functions either
 * was causing issues like Illegal invocation which couldn't be solved by simple bind(original)
 */


module.exports = function handleObject({ request, filename, original, originalError, getMock }) {

  // return original;

  return new Proxy(original, {  });
  // return new Proxy(original, { get, set });

  function get(target, key, receiver) {
    let mock = getMock();
    if (typeof mock[key] === 'undefined') {
      mock = original
    }
    let ret = Reflect.get(mock, key, receiver);

    if (typeof ret === 'function') {
      // Because:
      // http://stackoverflow.com/questions/42496414/illegal-invocation-error-using-es6-proxy-and-node-js
      // https://github.com/nodejs/node/issues/11629
      function proxy() {
        if (new.target) {
          return new ret(...arguments);
        } else {
          try {
            return ret.apply(this, arguments);
          } catch (error) {
            if (error.message.match(/illegal invocation/i)) {
              return ret.apply(original, arguments);
            } else {
              throw error;
            }
          }
        }
      }
      proxy.prototype = Object.create(ret.prototype || {});
      Object.assign(proxy, ret);
      // const bound = ret.bind(original);
      // bound.prototype = Object.create(ret.prototype || {});
      // Object.assign(bound, ret);
      // ret = bound;
      ret = proxy;
    }

    return ret;
  }

  function set(target, key, value) {
    original[key] = value;
    return true;
  }
}
