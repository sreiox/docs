---
outline: deep
---

## Buffer

Buffer 对象用于表示固定长度的字节序列。许多 Node.js API 都支持 Buffer。

Buffer 类是 JavaScript Uint8Array 类的子类，并使用涵盖额外用例的方法对其进行扩展。Node.js API 在支持 Buffer 的地方也接受纯 Uint8Array。

虽然 Buffer 类在全局作用域内可用，但仍然建议通过 import 或 require 语句显式地引用它。

### 缓冲区和字符编码

在 Buffer 和字符串之间转换时，可以指定字符编码。如果未指定字符编码，则默认使用 UTF-8。

Node.js 缓冲区接受它们接收到的编码字符串的所有`大小写变体`。例如，`UTF-8 可以指定为 'utf8'、'UTF8' 或 'uTf8'。`

Node.js 目前支持的字符编码如下：
- `'utf8'`（别名：'utf-8'）：多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8。这是默认的字符编码。
- `'utf16le'`：（别名：'utf-16le'）：多字节编码的 Unicode 字符。与 'utf8' 不同，字符串中的`每个字符都将使用 2 或 4 个字节`进行编码。
- `'base64'`：Base64 编码。base64 编码的字符串中包含的空白字符（例如空格、制表符和换行符）会被忽略。
- `'base64url'`：当从字符串创建 Buffer 时，此编码也将正确接受常规的 base64 编码的字符串。当将 Buffer 编码为字符串时，此编码将忽略填充。
- `'hex'`：将每个字节编码为两个十六进制字符。`当解码不完全由偶数个十六进制字符组成的字符串时，可能会发生数据截断。`

### 缓冲区和 TypedArray

### 缓冲区和迭代

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

### Blob

Blob 封装了不可变的原始数据，可以在多个工作线程之间安全地共享。

#### new buffer.Blob([sources[, options]])

#### 未完待续...

### Buffer

Buffer 类是一个全局类型，用于直接处理二进制数据。它可以用多种方式构建。

#### Buffer.alloc(size[, fill[, encoding]])

- size `<integer>` 新的 Buffer 所需的长度。
- fill `<string> | <Buffer> | <Uint8Array> | <integer>` 用于预填充新 Buffer 的值。默认值：0。
- encoding `<string>` 如果 fill 是字符串，则这就是它的编码。默认值：'utf8'。

分配 size 个字节的新 Buffer。如果 fill 为 undefined，则 Buffer 将被填零。
```js
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>

const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

如果 size 大于 `buffer.constants.MAX_LENGTH` 或小于 0，则抛出 `ERR_OUT_OF_RANGE`。

如果 size 不是数值，则会抛出 TypeError。

#### Buffer.allocUnsafe(size)

#### Buffer.allocUnsafeSlow(size)

#### Buffer.byteLength(string[, encoding])

```js
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```

#### Buffer.compare(buf1, buf2)

比较 buf1 和 buf2，通常用于对 Buffer 实例的数组进行排序。这相当于调用 buf1.compare(buf2)。

```js
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare), Buffer.compare(buf1, buf2));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]  1
// (This result is equal to: [buf2, buf1].)
```

#### Buffer.concat(list[, totalLength])

返回新的 Buffer，它是将 list 中的所有 Buffer 实例连接在一起的结果。

如果列表没有条目，或者 totalLength 为 0，则返回新的零长度 Buffer。

如果未提供 totalLength，则从 list 中的 Buffer 实例通过相加其长度来计算。

如果提供了 totalLength，则将其强制为无符号整数。如果 list 中的 Buffer 的组合长度超过 totalLength，则结果将被截断为 totalLength。

```js
const { Buffer } = require('node:buffer');

// Create a single `Buffer` from a list of three `Buffer` instances.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```

#### Buffer.copyBytesFrom(view[, offset[, length]])
- view `<TypedArray>` 要复制的 `<TypedArray>`。
- offset `<integer>` view 中的起始偏移量。Default::0。
- length `<integer>` view 中要复制的元素数。默认值：view.length - offset。

```js
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```

#### Buffer.from(array)

```js
const { Buffer } = require('node:buffer');

// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

### Buffer.from(array)

### Buffer.from(arrayBuffer[, byteOffset[, length]])

```js
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer

const arr1 = new Uint16Array(2);
const buf4 = Buffer.from(arr1)
console.log(arr1.buffer, Buffer.isBuffer(arr1), Buffer.isBuffer(buf4)) // false true
```

### Buffer.from(object[, offsetOrEncoding[, length]])

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74> ??????????没输出啊
```

#### Buffer.isBuffer(obj)

#### Buffer.isEncoding(encoding)

### Buffer.poolSize

#### buf[index]

```js
const { Buffer } = require('node:buffer');

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```

#### buf.buffer

```js
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

#### buf.byteOffset

```js
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
// Uint8Contents]: <2f 00 00 00 00 00 00 00 2f 00 00 00 00 00 00 00 63 6f 6e 73 74 20 68 74 74 70 20 3d 20 72 65 71 75 69 72 65 28 27 6e 6f 64 65 3a 68 74 74 70 27 29 0a 0a 63 6f 6e 73 74 20 73 65 72 76 65 72 20 3d 20 68 74 74 70 2e 63 72 65 61 74 65 53 65 72 76 65 72 28 28 72 65 71 2c 20 72 65 73 29 20 3d 3e 20 7b 0a ... 8092 more bytes>,
//   byteLength: 8192
// } 1824 10
```

#### buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])

```js
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

#### buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])

```js
const { Buffer } = require('node:buffer');

// Create two `Buffer` instances.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

// Copy `buf1` bytes 16 through 19 into `buf2` starting at byte 8 of `buf2`.
buf1.copy(buf2, 8, 16, 20);
// This is equivalent to:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Prints: !!!!!!!!qrst!!!!!!!!!!!!!
```

#### buf.entries()

```js
const { Buffer } = require('node:buffer');

// Log the entire contents of a `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

#### buf.equals(otherBuffer)

```js
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```

#### buf.fill(value[, offset[, end]][, encoding])

```js
const { Buffer } = require('node:buffer');

// Fill a `Buffer` with the ASCII character 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Fill a buffer with empty string
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Prints: <Buffer 00 00 00 00 00>
```

#### buf.includes(value[, byteOffset][, encoding])

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

#### buf.indexOf(value[, byteOffset][, encoding])

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

#### buf.keys()

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

#### buf.lastIndexOf(value[, byteOffset][, encoding])

#### buf.length

#### buf.readBigInt64BE([offset])

#### buf.readBigInt64LE([offset])

#### buf.readBigUInt64BE([offset])

#### buf.readBigUInt64LE([offset])

#### buf.readDoubleBE([offset])

#### buf.readDoubleLE([offset])

#### buf.readFloatBE([offset])

#### buf.readFloatLE([offset])

#### buf.readInt8([offset])

#### buf.readInt16BE([offset])

#### buf.readInt16LE([offset])

#### buf.readInt32BE([offset])

#### buf.readInt32LE([offset])

#### buf.readIntBE(offset, byteLength)

#### buf.readIntLE(offset, byteLength)

#### buf.readUInt8([offset])

#### buf.readUInt16BE([offset])

#### buf.readUInt16LE([offset])

#### buf.readUInt32BE([offset])

#### buf.readUInt32LE([offset])

#### buf.readUIntBE(offset, byteLength)

#### buf.readUIntLE(offset, byteLength)

#### buf.subarray([start[, end]])

返回新的 Buffer，其引用与原始缓冲区相同的内存，但由 start 和 end 索引进行偏移和裁剪。

#### buf.toJSON()

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

#### buf.toString([encoding[, start[, end]]])

```js
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

#### buf.values()

```js
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

#### buf.write(string[, offset[, length]][, encoding])

根据 encoding 中的字符编码将 string 写入 buf 的 offset 处。length 参数是要写入的字节数。如果 buf 没有足够的空间来容纳整个字符串，则只会写入 string 的一部分。但是，不会写入部分编码的字符。
```js
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

#### buf.writeBigInt64BE(value[, offset])

### File

#### new buffer.File(sources, fileName[, options])

##### file.name

##### file.lastModified

### node:buffer 模块 API

#### buffer.isAscii(input)

#### buffer.isUtf8(input)

#### buffer.isUtf8(input)

#### buffer.kMaxLength

#### buffer.kStringMaxLength

#### buffer.transcode(source, fromEnc, toEnc)

将给定的 Buffer 或 Uint8Array 实例从一种字符编码重新编码为另一种。返回新的 Buffer 实例。

如果 fromEnc 或 toEnc 指定无效的字符编码或不允许从 fromEnc 转换为 toEnc，则抛出错误。

buffer.transcode() 支持的编码有：'ascii'、'utf8'、'utf16le'、'ucs2'、'latin1' 和 'binary'。

如果给定的字节序列不能在目标编码中充分表示，则转码过程将使用替换字符。例如：
```js
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
由于欧元 (€) 符号在 US-ASCII 中无法表示，因此在转码后的 Buffer 中将其替换为 ?。

### 缓冲区常量

#### buffer.constants.MAX_LENGTH

#### buffer.constants.MAX_STRING_LENGTH