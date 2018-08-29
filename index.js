const mocks = require('./mocks');

require('./init')();

module.exports = (key, value) => {
  mocks.set(key, value);
  return () => mocks.delete(key);
};
