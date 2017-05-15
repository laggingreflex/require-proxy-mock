const assert = require('assert');
const mocks = require('..');

const cleanMocks = () => {
  for (const key in mocks) {
    delete mocks[key];
  }
};
beforeEach(cleanMocks);
afterEach(cleanMocks);

describe('object', () => {
  const object = require('./exports/object');
  const mock = { mock: true, test: false };
  it('properties', () => {
    assert.equal(object.test, true);
    assert.equal(object.mock, undefined);
    mocks['./exports/object'] = mock;
    assert.equal(object.mock, true);
    assert.equal(object.test, false);
    delete mocks['./exports/object'];
    assert.equal(object.some, undefined);
  });
});

describe.skip('boolean', () => {
  const boolean = require('./exports/boolean');
  const mock = false;
  it('should mock boolean', () => {
    assert.equal(boolean, true);
    mocks['./exports/boolean'] = mock;
    assert.equal(boolean, false);
  });
});


describe('function', () => {
  const fn = require('./exports/function');
  const mock = () => 'mock';
  it('call', () => {
    assert.equal(fn(), 'test');
    mocks['./exports/function'] = mock;
    assert.equal(fn(), 'mock');
  });
});

describe('class', () => {
  const cn = require('./exports/class');
  class Mock {
    constructor() {
      this.mock = true;
    }
    method() {
      return this.mock;
    }
  };

  it('new', () => {
    const c = new cn()
    assert(c.test, true);

    mocks['./exports/class'] = Mock;
    const m = new cn()
    assert(m.mock, true);
  });
});

describe('css', () => {
  it('should normally error', () => {
    try {
      require('./exports/css.css');
      throw new Error('did not error');
    } catch (noop) {}
  });
  it('should not error when mocked', () => {
    mocks['./exports/css.css'] = {}
    require('./exports/css.css');
  });
});

describe('regex request', () => {
  it('should mock regex requests', () => {
    mocks['/css$/i'] = { mock: true };
    const css = require('./exports/css.css');
    assert(css.mock, true);
  });
});
