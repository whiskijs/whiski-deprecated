# whiski.js

⚡ install web code fast and light

---

```bash
$npm install whiski
$yarn add whiski
```

## Useage

```js
const whiski = require('whiski');
whiski.install('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
```

### Install Typescript Code

```js
/* ... */
whiski.install('URL', { extension: 'ts' });
```

### Install Github, Deno Code

use [`@whiski/kit`](https://npmjs.com/package/@whiski/kit)

```bash
$ npm install @whiski/kit
$ yarn add @whiski/kit
```
