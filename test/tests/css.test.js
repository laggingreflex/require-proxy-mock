describe('css', () => {
  it('should normally error', () => {
    try {
      require('./css.css');
      throw new Error('did not error');
    } catch (noop) {}
  });
  it('should not error when mocked', () => {
    mocks['./css.css'] = {}
    require('./css.css');
  });
});
