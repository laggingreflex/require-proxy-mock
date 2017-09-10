# require-proxy-mock

Automatically and transparently patches all `require` calls ([Module._load]) to return an [ES6 Proxy] wrapper around the original module's export(s) which can later be mocked/unmocked as required.

Somewhat similar to [proxyquire], [rewire], and [Jest]'s [automock].

**Requires node v6+**

[Module._load]: https://github.com/nodejs/node/blob/47038242767c69a495ccf754246983c320352eb5/lib/module.js#L432
[proxyquire]: https://github.com/thlorenz/proxyquire
[rewire]: https://github.com/jhnns/rewire
[jest]: http://facebook.github.io/jest
[automock]: http://facebook.github.io/jest/docs/configuration.html#automock-boolean

[ES6 Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy

## Install

```sh
npm install --save-dev require-proxy-mock
```

## Usage

Require once **before** loading any other modules:

```sh
mocha --require=require-proxy-mock  **/*.test.js
```

Then require it as an object in your test(s) and add/remove properties on it with the same key names as the originally required files you want to mock:

**`main.test.js`**

```js
import mock from 'require-proxy-mock'
import main from './main'

describe('main', () => {
  before(() => {

    // Mock exports from file required (in main.js below) as 'some-lib'

    mock['some-lib'] = { default: () => 1 };

    // Note: Using "default" because ES6 module

  })
  after(() => {
    delete mock['some-lib']
    // Restore original exports
  })

  it('should mock', () => {
    assert(main(), 1)
  });
});

```

**`main.js`**

No change required in this file

```js
import someLib from 'some-lib' // auto-mocked in test above

export default (..args) => someLib(..args)
```

