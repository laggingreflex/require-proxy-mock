global.assert = require('assert');
global.mocks = require('..');

const cleanMocks = () => {
  for (const key in mocks) {
    delete mocks[key];
  }
};

beforeEach(cleanMocks);
afterEach(cleanMocks);
