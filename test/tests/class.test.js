const cn = require('./class');

describe('class', () => {
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

    mocks['./class'] = Mock;
    const m = new cn()
    assert(m.mock, true);
  });
});
