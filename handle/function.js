/**
 * Can't mock functions
 * was causing issues like Function.prototype.toString is not generic
 */

const handleClass = require('./class');

module.exports = function handleFunction({ request, filename, original, originalError, getMock }) {

  return original;

  const proxy = new Proxy(original, {
    apply,
    construct,
    // get,
    // set,
  });

  // function proxy(...args) {
  //   const mock = getMock();
  //   if (new.target) {
  //     return new mock(args);
  //   } else {
  //     return mock.call(this, ...args);
  //   }
  //   // return Reflect.apply(mock, thisArg, args);
  // }
  // proxy.prototype = Object.create(original.prototype || {});
  // // proxy.prototype.constructor = original;
  // Object.assign(proxy, original);

  // Object.defineProperties()

  // if (request.match('debug')) {
  //   return new Proxy(proxy, { get, set });
  // }

  return proxy;

  function apply(target, thisArg, args) {
    const mock = getMock();
    return mock.apply(thisArg, args);
    const ret = Reflect.apply(mock, thisArg, args);
    last(() => {
      console.log(`last apply ret`, ret);
      console.log(`last apply request`, request);
      console.log(`last apply filename`, filename);
    });
    return ret;
    return Reflect.apply(mock, thisArg, args);
  }

  function construct(target, args, newTarget) {
    const mock = getMock();
    return new mock(...args);
    // return Reflect.construct(mock, args, newTarget);
  }

  function get(target, key, receiver) {
    let obj = getMock();
    if (typeof obj[key] === 'undefined') {
      obj = original
    }
    // return Reflect.get(obj, key, receiver);
    let prop = Reflect.get(obj, key, receiver);
    if (typeof prop === 'function') {
      const bound = prop.bind(prop);
      bound.prototype = Object.create(prop.prototype || {});
      prop = bound;
    }
    return prop;


    // const obj = getMock();
    // const mockedProp = obj[name];
    // let prop;
    // if (typeof mockedProp !== 'undefined') {
    //   prop = mockedProp;
    // } else {
    //   prop = original[name];
    // }
    // // if (typeof prop === 'function') {
    // //   // prop = prop.bind(proxy);
    // //   // http://stackoverflow.com/questions/42496414/illegal-invocation-error-using-es6-proxy-and-node-js
    // //   prop = prop.bind(original);
    // // }
    // return prop;
  }

  function set(target, key, value) {
    original[key] = value;
    return true;
  }
}
