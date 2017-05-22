const boolean = require('./boolean');

describe.skip('boolean', () => {
  const mock = false;
  it('should mock boolean', () => {
    assert.equal(boolean, true);
    mocks['./boolean'] = mock;
    assert.equal(boolean, false);
  });
});
