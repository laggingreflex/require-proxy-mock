const mocks = require('./mocks');

require('./init')();

exports.mocks = mocks;

exports.mock = (...args) => {
  if (args.length === 1) {
    if (args[0] instanceof Map) {
      return exports.mockByMap(...args);
    } else {
      return exports.mockByObject(...args);
    }
  } else if (args.length === 2) {
    return exports.mockSingle(...args);
  } else {
    throw new Error('Unexpected args');
  }
};

exports.mockByObject = obj => {
  for (const key in obj) {
    mocks.set(key, obj[key]);
  }
  return () => {
    for (const key in obj) {
      mocks.delete(key);
    }
  };
};

exports.mockByMap = map => {
  for (const [key, value] of map) {
    mocks.set(key, value);
  }
  return () => {
    for (const [key] of map) {
      mocks.delete(key);
    }
  };
};

exports.mockSingle = (key, value) => {
  mocks.set(key, value);
  return () => mocks.delete(key);
};

exports.unmock = (key) => {
  mocks.delete(key);
};

exports.unmockAll = () => {
  for (const [key] of mocks) {
    mocks.delete(key);
  }
};
