describe('css with regex', () => {
  it('should not error when mocked', () => {
    mocks['/css$/i'] = { mock: true };
    require('./css.css');
  });
});
