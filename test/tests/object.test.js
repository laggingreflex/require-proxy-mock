const object = require('./object');

describe('object', () => {
  const mock = { mock: true, test: false };
  it('properties', () => {
    assert.equal(object.test, true);
    assert.equal(object.mock, undefined);
    mocks['./object'] = mock;
    assert.equal(object.mock, true);
    assert.equal(object.test, false);
    delete mocks['./object'];
    assert.equal(object.some, undefined);
  });
});
