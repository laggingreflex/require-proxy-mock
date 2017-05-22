module.exports = function handleClass({ request, filename, original, originalError, getMock }) {

  // return new Proxy(original, {});

  // return original;

  var descriptor = Object.getOwnPropertyDescriptor(original.prototype, 'constructor');
  base.prototype = Object.create(sup.prototype);


  return new Proxy(original, { apply, construct, get, set });

  function apply(_, _this, _args) {
    const fn = getMock();
    return Reflect.apply(fn, _this, _args);
    // return fn.call(_this, ..._args);
  }

  function construct(_, _args, newTarget) {
    const cn = getMock();
    return new cn(..._args);
    return Reflect.construct(cn, _args, newTarget);
    // const obj = Object.create(original.prototype);
    // this.apply(original, obj, _args);
    // return obj;


    // return new cn(..._args);
    // return new cn.apply(this, _args);
    // return new cn.apply(null, _args);
    // return new (cn.bind.apply(null, _args))
    // return new (cn.bind.apply(this, _args))
    // return new (cn.bind.apply(nt, _args))
    // return new (cn.bind.apply(null, _args))()
    // return new (cn.bind.apply(cn, _args))();
  }

  function get(_, key, receiver) {
    let obj = getMock();
    if (typeof obj[key] === 'undefined') {
      obj = original
    }
    arguments[0] = obj;
    return Reflect.apply(Reflect.get, Reflect, arguments);


    return Reflect.get(obj, key, receiver);

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

  function set(_, prop, value) {
    arguments[0] = original;
    return Reflect.apply(Reflect.set, Reflect, arguments);
  }
}
