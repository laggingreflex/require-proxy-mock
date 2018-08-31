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

**Important**: Require once **before** loading any other modules:

```sh
mocha --require require-proxy-mock **/*.test.js
```

Then require it as an object in your test(s) and add/remove properties on it with the same key names as the originally required files you want to mock:

* **`main.js`** - A typical module file; no change required here

    ```js
    const someLib = require('some-lib');
    // Which exports a function like:
    // () => 'original'

    module.exports = someLib;
    ```

* **`main.test.js`**

    ```js
    const {mock} = require('require-proxy-mock');
    const main = require('./main');

    describe('main', () => {
      before(() => {
        mock('some-lib', () => 'MY MOCK');
      })
      it('should mock', () => {
        assert(main(), 'MY MOCK')
      });
      after(() => {
        unmock('some-lib')
      })
    });

    ```


