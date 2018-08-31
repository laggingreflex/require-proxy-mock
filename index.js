const mocks = require('./mocks');

require('./init')();

exports.mocks = mocks;

exports.mock = (key, value) => {
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
