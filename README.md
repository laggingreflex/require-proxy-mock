# require-proxy-mock

Automatically and transparently patches all `require` calls ([Module._load]) to return an [ES6 Proxy] wrapper around the original module's export(s) which can later be mocked/unmocked as required.

Somewhat similar to [proxyquire], [rewire], and [Jest]'s [automock].

**Requires Node v6+** (try 10+ if you're getting errors like [this][11629])

[11629]: https://github.com/nodejs/node/issues/11629

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

### API

```js
const { mock } = require('require-proxy-mock')
```
```js
mock(dep, mock)
mock({dep: mock, ...})
mock(Map {dep => mock, ...})
```
* **`dep`** `[string|regex]` Require request of the dependency to mock.

* **`mock`** Mock that replaces the required dependency.


### Example

**Important**: Require once **before** loading any other modules:

```sh
mocha --require require-proxy-mock **/*.test.js
```

Then require it as an object in your test(s) and add/remove properties on it with the same key names as the originally required files you want to mock:

* **`main.js`** - A typical module file; no change required here

    ```js
    const someLib = require('some-lib')
                             ^^^^^^^^ will be mocked
    module.exports = someLib
    ```

  * **`some-lib.js`** - Dependency that'll be mocked

      ```js
      module.exports = () => 'ORIGINAL'
      ```

* **`main.test.js`**

    ```js
    const {mock} = require('require-proxy-mock')
    const main = require('./main')

    describe('main', () => {
      let unmock
      before(() => {
        unmock = mock('some-lib', () => 'CHANGED')
                       ^^^^^^^^ mocked
      })
      it('should mock', () => {
        assert(main(), 'CHANGED')
      })
      after(() => {
        unmock()
      })
    })
    ```

## Limitations

Cannot mock primitives (since they can't be proxied).

