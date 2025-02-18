'use strict';
const {ObjectId} = require('bson');
// see if it looks and smells like an iterable object, and do accept length === 0
function isArrayLike(item) {
  if (Array.isArray(item)) return true;

  const len = item && item.length;
  return typeof len === 'number' && (len === 0 || (len - 1) in item) && typeof item.indexOf === 'function';
}

function fclone(obj, refs) {
  if (!obj || "object" !== typeof obj) return obj;

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj)) {
    return Buffer.from(obj);
  }

  // typed array Int32Array etc.
  if (typeof obj.subarray === 'function' && /[A-Z][A-Za-z\d]+Array/.test(Object.prototype.toString.call(obj))) {
    return obj.subarray(0);
  }

  // MongoDB ObjectId
  if(obj instanceof ObjectId) return new ObjectId(obj);

  if (!refs) { refs = []; }

  if (isArrayLike(obj)) {
    refs[refs.length] = obj;
    let l = obj.length;
    let i = -1;
    let copy = [];

    while (l > ++i) {
      copy[i] = ~refs.indexOf(obj[i]) ? '[Circular]' : fclone(obj[i], refs);
    }

    refs.length && refs.length--;
    return copy;
  }

  refs[refs.length] = obj;
  let copy = {};

  if (obj instanceof Error) {
    copy.name = obj.name;
    copy.message = obj.message;
    copy.stack = obj.stack;
  }

  let keys = Object.keys(obj);
  let l = keys.length;
  let i = 0;
  if(l>0){
    do{
      let k = keys[i];
      copy[k] = ~refs.indexOf(obj[k]) ? '[Circular]' : fclone(obj[k], refs);
    } while(++i<l);
  }

  refs.length && refs.length--;
  return copy;
}

fclone.default = fclone
