<center><h2>whiski.js</h2>⚡ install web code fast and light</center>

---

```bash
$npm install whiskijs
$yarn add whiskijs
```

## Useage

```js
const whiski = require('whiskijs');
whiski.default('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
```

### Download Typescript Code

use [`@whiski/plugin-typescript`](https://www.npmjs.com/package/@whiski/plugin-typescript) to download typescript code.

```js
const whiski = require('whiskijs');
const typescript = require('@whiski/plugin-typescript');
whiski.default('{TSCODE_URL}', { plugins: [typescript.default()], extension: 'ts' });
```
