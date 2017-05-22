# Doesn't work

It turns out that this doesn't really work in complex situations as I had hoped. There's various issues highlighted in the code if anyone wants to take a crack at it. It's not usable as such in its current condition.

---

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

Register once **before** loading any other modules:

```sh
mocha --require=require-proxy-mock/register  **/*.test.js
```

Then require it as an object in your test(s) and add/remove properties on it with the same key names as the originally required files you want to mock:

**`main.test.js`**

```js
import mock from 'require-proxy-mock'
import main from './main'

describe('main', () => {
  before(() => {

    // Mock exports from file required as '../to-be-mocked'

    mock['../to-be-mocked'] = { default: () => 1 };

    // Note: Using "default" because ES6 module

  })
  after(() => {
    delete mock['../to-be-mocked']
    // Restore original exports
  })

  it('should mock', () => {
    assert(main(), 1)
  });
});

```

**`main.js`**

```js
import toBeMocked from '../to-be-mocked' // mocked in test above

export default main (..args) => toBeMocked(..args)
```


