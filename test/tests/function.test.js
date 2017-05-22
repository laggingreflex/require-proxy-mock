const fn = require('./function');

describe('function', () => {
  const mock = () => 'mock';
  it('call', () => {
    assert.equal(fn(), 'test');
    mocks['./function'] = mock;
    assert.equal(fn(), 'mock');
  });
});
