# FClone

Original FClone reverses object key order, this repo "fixes" this behaviour
Also adds support for MongoDB ObjectIds (https://www.npmjs.com/package/objectid)

Clone objects by dropping circular references

This module clones a Javascript object in safe mode (eg: drops circular values) recursively. Circular values are replaced with a string: `'[Circular]'`.

## Installation

```bash
npm install @crunkstar/fclone
# or
bower install @crunkstar/fclone
```

## Usage

```javascript
const fclone = require('@crunkstar/fclone');

let a = {c: 'hello'};
a.b = a;

let o = fclone(a);

console.log(o);
// outputs: { c: 'hello', b: '[Circular]' }

//JSON.stringify is now safe
console.log(JSON.stringify(o));
```