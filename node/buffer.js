const http = require('node:http')
const { transcode, constants } = require('node:buffer')

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain'})
    res.end('connection success')
})

const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare), Buffer.compare(buf1, buf2));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ] 1
// (This result is equal to: [buf2, buf1].)

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf3 = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
const arr1 = new Uint16Array(2);
const buf4 = Buffer.from(arr1)
console.log(arr1.buffer, Buffer.isBuffer(arr1), Buffer.isBuffer(buf4)) // false true

class Foo {
    [Symbol.toPrimitive]() {
      return 'this is a test';
    }
  }
  
  const buf5 = Buffer.from(new Foo(), 'utf8');
//   console.log('buf5', buf5, `${Buffer.from(new String('this is a test'), 'hex')}`, `${Buffer.isBuffer(Buffer.from(new String('this is a test')))}`)
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>

const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
// console.log('nodeBuffer', nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
console.log(`${transcode(Buffer.from('€'), 'utf8', 'ascii')}`, `${constants.MAX_STRING_LENGTH}`)


server.listen(3030, '127.0.0.1', ()=>{
    console.log('server start...')
})