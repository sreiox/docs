---
outline: deep
---

## Promise API

该 fs/promises API 提供了返回 promise 的异步的文件系统方法。

Promise API 使用底层的 Node.js 线程池在事件循环线程之外执行文件系统操作。这些操作不是同步的也不是线程安全的。对同一文件执行多个并发修改时必须小心，否则可能会损坏数据。

### FileHandle

`<FileHandle>` 对象是数字文件描述符的对象封装。

`<FileHandle>` 对象的实例通过 fsPromises.open() 方法创建

如果未使用 filehandle.close() 方法关闭 `<FileHandle>`，则它将尝试自动关闭文件描述符并触发进程警告，从而有助于防止内存泄漏。请不要依赖此行为，因为它可能不可靠并且该文件可能未被关闭。相反，始终显式关闭 `<FileHandle>`。Node.js 将来可能会更改此行为。

#### event:close

当 `<FileHandle>` 已关闭且不再可用时，则触发 'close' 事件。

#### filehandle.appendFile(data[, options])

- data `<string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>`
- options `<Object> | <string>`
    - encoding `<string> | <null> `默认值：'utf8'
    - flush `<boolean>` 如果是 true，则在关闭基础文件描述符之前将其刷新。默认值：false。
- 返回：`<Promise> `成功时将使用 undefined 履行。

filehandle.writeFile() 的别名。
当在文件句柄上进行操作时，则无法将模式更改为使用 fsPromises.open() 设置的模式。因此，这相当于 filehandle.writeFile()。

```js
const fs = require('fs')

fs.appendFile('./node/file.text', 'hello world!', (err) => {
    if(err) {
        console.error('追加数据到文件时发生错误:', err);
        return
    }
    console.log('数据已成功追加到文件');
})
```

#### (filehandle.chmod(mode))[https://nodejs.cn/api/fs.html#fschmodpath-mode-callback]

- mode `<integer>` 文件模式位掩码。
- 返回：`<Promise>` 成功时将使用 undefined 履行。

修改文件的权限

```js
fs.chmod('./node/file.text', 0o755, (err) => {
    if (err) {
        console.error('更改文件权限时发生错误:', err);
        return;
      }
      console.log('文件权限已成功更改');
})
```

#### filehandle.chown(uid, gid)

- uid `<integer>` 文件的新所有者的用户 ID。
- gid `<integer>` 文件的新群组的组 ID。
- 返回：`<Promise>` 成功时将使用 undefined 履行。

更改文件的所有权

#### filehandle.createReadStream([options])

- options `<Object>`

    - encoding `<string>` 默认值：null

    - autoClose `<boolean>` 默认值：true

    - emitClose `<boolean>` 默认值：true

    - start `<integer>`

    - end `<integer>` 默认值：Infinity

    - highWaterMark `<integer>` 默认值：64 * 1024

与 `<stream.Readable>` 的 16 KiB 默认 highWaterMark 不同，此方法返回的流的默认 highWaterMark 为 64 KiB。

options 可以包括 start 和 end 值，以从文件中读取一定范围的字节，而不是整个文件。start 和 end 均包含在内并从 0 开始计数，允许的值在 [0, Number.MAX_SAFE_INTEGER] 范围内。如果省略 start 或为 undefined，则 filehandle.createReadStream() 从当前的文件位置开始依次读取。encoding 可以是 `<Buffer>` 接受的任何一种。

读取 100 个字节长的文件的最后 10 个字节的示例：

```js
// 创建可读流
const readableStream = fs.createReadStream('./node/file.text', { encoding: 'utf8', start: 2, end: 4 });

// 监听 data 事件来处理数据
readableStream.on('data', (chunk) => {
    console.log('接收到数据:', chunk);
    res.end(chunk)
});

// 监听 end 事件来处理读取结束
readableStream.on('end', () => {
    console.log('文件读取结束');
});
```

#### filehandle.createWriteStream([options])

写入大批量数据可分块文件

```js
// 创建可读流
const createWriteStream = fs.createWriteStream('./node/file.text', { encoding: 'utf8' });
createWriteStream.write(jsonData.text)
createWriteStream.end()
// 监听 data 事件来处理数据
createWriteStream.on('finish', (chunk) => {
    console.log('数据写入完成');
});

// 监听 end 事件来处理读取结束
createWriteStream.on('error', (err) => {
    console.error('写入文件时发生错误:', err);
});
```

#### filehandle.datasync()

将与文件关联的所有当前排队的 I/O 操作强制为操作系统的同步 I/O 完成状态。
与 filehandle.sync 不同，此方法不会刷新修改的元数据。

#### filehandle.fd

对象管理的数字文件描述符。

#### filehandle.read(buffer, offset, length, position)

- buffer `<Buffer> | <TypedArray> | <DataView>` 将填充读取的文件数据的缓冲区。
- offset `<integer>` 缓冲区中开始填充的位置。
- length `<integer>` 读取的字节数。
- position `<integer> | <null>` 从文件开始读取数据的位置。如果为 null，则将从当前文件位置读取数据，并将更新该位置。如果 position 是整数，则当前文件位置将保持不变。
- 返回：`<Promise>` 成功时将使用具有以下两个属性的对象履行：
    - bytesRead `<integer>` 读取的字节数
    - buffer `<Buffer> | <TypedArray> | <DataView>` 对传入的 buffer 参数的引用。

从文件中读取数据，并将其存储在给定的缓冲区中。
如果未同时修改文件，当读取的字节数为零时，则到达文件末尾。

```js
fs.open('./node/file.doc', (err, fd) => {
    if(err){
        console.error('文件打开时错误', err)
        return
    }

    const buffer = Buffer.alloc(1024)
    console.log(`fd:>>${fd}`)
    fs.read(fd, buffer, 0, buffer.length, 0, async (err, bytesread, buffer) => {
        if(err){
            console.error('文件读取时发生错误', err)
            return
        }
        
        //打印实际读取的字节数  为什么乱码？？？？？
        console.log('实际读取的字节数', buffer.toString('utf8', 0, bytesread))
        console.log('读取的内容', con)

        const createWriteStream = fs.createWriteStream('./node/file.text', { encoding: 'utf-8'})
        createWriteStream.write(buffer.toString('utf8', 0, bytesread))
        createWriteStream.end()
        createWriteStream.on('finish', () => {
            console.error('数据写入完成')
        })
        createWriteStream.on('error', (err) => {
            if(err){
                console.error('数据写入时发生错误', err)
                return
            }
        })


        fs.close(fd, (err) => {
            if(err){
                console.error('关闭文件时发生错误', err)
            }
        })
    })

})
```

#### filehandle.read([options])

#### filehandle.read(buffer[, options])

#### filehandle.readFile(options)

- options `<Object> | <string>`

    - encoding `<string> | <null>` 默认值：null

    - signal `<AbortSignal>` 允许中止正在进行的 readFile

- 返回：`<Promise>` 成功读取时将使用文件内容履行。如果未指定编码（使用 options.encoding），则数据作为 `<Buffer>` 对象返回。否则，数据将为字符串。

异步地读取文件的全部内容。
如果 options 是字符串，则它指定 encoding。
如果在文件句柄上进行了一次或多次 `filehandle.read() `调用，然后进行 `filehandle.readFile()` 调用，则将从`当前位置读取数据`，直到文件末尾。它`并不总是从文件的开头读取`。

```js
fs.readFile("./node/file.text", 'utf8', (err, data) => {
    if (err) {
      console.error("读取文件时发生错误:", err);
      return;
    }
  
    console.log(data)
  });
```

#### filehandle.readLines([options])

- options `<Object>`
    - encoding `<string>` 默认值：null
    - autoClose `<boolean>` 默认值：true
    - emitClose `<boolean>` 默认值：true
    - start `<integer>`
    - end `<integer>` 默认值：Infinity
    - highWaterMark `<integer>` 默认值：64 * 1024
- 返回：`<readline.InterfaceConstructor>`

#### filehandle.readv(buffers[, position])

- buffers `<Buffer[]> | <TypedArray[]> | <DataView[]>`
- position `<integer> | <null>` 要从中读取数据的文件的开头偏移量。如果 position 不是 number，则将从当前位置读取数据。默认值：null
- 返回：`<Promise>` 成功时将使用包含以下两个属性的对象履行：
    - bytesRead `<integer>` 读取的字节数
    - buffers `<Buffer[]> | <TypedArray[]> | <DataView[]>` 包含对 buffers 输入的引用的属性。

从文件读取并写入 `<ArrayBufferView>` 数组

#### filehandle.stat([options])

- options `<Object>`
    - bigint `<boolean>` 返回的 `<fs.Stats>` 对象中的数值是否应为 bigint。默认值：false。
- 返回：`<Promise>` 通过文件的 `<fs.Stats>` 来履行。

```js
function getPermissionString(mode, type) {
    const read = (mode & 0o400) ? 'r' : '-';
    const write = (mode & 0o200) ? 'w' : '-';
    const execute = (mode & 0o100) ? 'x' : '-';
    
    if (type === 'user') {
      return `${read}${write}${execute}`;
    } else if (type === 'group') {
      return `${read}${write}${execute}`;
    } else if (type === 'others') {
      return `${read}${write}${execute}`;
    }
  }
fs.stat('./node/file.text', (err, stats) => {
    if (err) {
        console.error('获取文件状态信息时发生错误:', err);
        return;
    }
    // 输出文件的权限信息
  console.log('文件的权限信息:');
  console.log(`用户权限 (owner): ${getPermissionString(stats.mode, 'user')}`);
  console.log(`群组权限 (group): ${getPermissionString(stats.mode, 'group')}`);
  console.log(`其他用户权限 (others): ${getPermissionString(stats.mode, 'others')}`);
})
```

#### filehandle.sync()

请求将打开文件描述符的所有数据刷新到存储设备。具体实现是操作系统和设备特定的

#### filehandle.truncate(len)

#### filehandle.utimes(atime, mtime)

更改 `<FileHandle>` 引用的对象的文件系统时间戳，然后在成功时不带参数地履行 promise。

#### filehandle.write(buffer, offset[, length[, position]])

- buffer `<Buffer> | <TypedArray> | <DataView>`
- offset `<integer>` 要开始写入数据的 buffer 的起始位置。
- length `<integer>` 要从 buffer 写入的字节数。默认值：buffer.byteLength - offset
- position `<integer> | <null>` 要写入来自 buffer 的数据的文件的开头偏移量。如果 position 不是 number，则数据将被写入当前位置。有关更多详细信息，请参阅 POSIX pwrite(2) 文档。默认值：null
- 返回：`<Promise>`

将 buffer 写入文件。

这个 promise 是通过一个包含两个属性的对象来实现的：
- bytesWritten `<integer>` 写入的字节数
- buffer `<Buffer> | <TypedArray> | <DataView>` 对被写入的 buffer 的引用。

在同一个文件上多次使用 filehandle.write() 而不等待 promise 被履行（或拒绝）是不安全的。对于这种情况，请使用 filehandle.createWriteStream()。

在 Linux 上，以追加模式打开文件时，位置写入不起作用。内核会忽略位置参数，并始终将数据追加到文件末尾。

```js
const fs = require('fs');

// 打开文件并获取文件描述符
fs.open('example.txt', 'a', (err, fd) => {
  if (err) {
    console.error('打开文件时发生错误:', err);
    return;
  }

  // 创建一个 Buffer 对象来存储要写入的数据
  const buffer = Buffer.from('Hello, world!');

  // 向文件中写入数据
  fs.write(fd, buffer, 0, buffer.length, null, (err, bytesWritten, buffer) => {
    if (err) {
      console.error('写入文件时发生错误:', err);
    } else {
      console.log('数据已成功写入到文件');
    }

    // 关闭文件描述符
    fs.close(fd, (err) => {
      if (err) {
        console.error('关闭文件时发生错误:', err);
      }
    });
  });
});

```

#### filehandle.write(buffer[, options])

#### filehandle.write(string[, position[, encoding]])

#### filehandle.writeFile(data, options)

- data `<string> | <Buffer> | <TypedArray> | <DataView> | <AsyncIterable> | <Iterable> | <Stream>`

- options `<Object> | <string>`

    - encoding `<string> | <null>` 当 data 为字符串时的预期字符编码。默认值：'utf8'

- 返回：`<Promise>`

异步地将数据写入文件，如果文件已经存在，则替换该文件。data 可以是字符串、缓冲区、`<AsyncIterable>`、或 `<Iterable> `对象。
如果 options 是`字符串`，则它指定 `encoding`。

在同一个文件上多次使用 filehandle.writeFile() 而不等待 promise 被履行（或拒绝）是不安全的。

如果在文件句柄上进行了一次或多次` filehandle.write() `调用，然后进行 `filehandle.writeFile()` 调用，则数据将从`当前位置写入`，直到文件末尾。它`并不总是从文件的开头写入`。

```js
const data = 'Hello, world!';

// 将数据写入到文件中
fs.writeFile('example.txt', data, (err) => {
  if (err) {
    console.error('写入文件时发生错误:', err);
    return;
  }
  
  console.log('数据已成功写入到文件');
});
```

#### filehandle.writev(buffers[, position])

#### fsPromises.access(path[, mode])

- path `<string> | <Buffer> | <URL>`
- mode `<integer>` 默认值：fs.constants.F_OK
- 返回：`<Promise>` 成功时将使用 undefined 履行。

测试用户对 path 指定的文件或目录的权限。
mode 参数是可选的整数，指定要执行的可访问性检查。mode 应该是值 fs.constants.F_OK 或由 fs.constants.R_OK、fs.constants.W_OK 和 fs.constants.X_OK 中的任何一个（例如 fs.constants.W_OK | fs.constants.R_OK）的按位或组成的掩码。检查 文件访问常量 以获得 mode 的可能值。

如果可访问性检查成功，则 promise 就得到履行，但没有任何值。如果任何可访问性检查失败，则使用 `<Error>` 对象拒绝 promise。以下示例检查当前进程是否可以读写文件 /etc/passwd。

不建议在调用 fsPromises.open() 之前使用 fsPromises.access() 检查文件的可访问性。这样做会引入竞争条件，因为其他进程可能会在两次调用之间更改文件的状态。而是，用户代码应直接打开/读取/写入文件，并处理无法访问文件时引发的错误。

```js
fs.access('./node/file.doc', fs.constants.R_OK, (err) => {
    if (err) {
      console.error('文件不存在');
    } else {
      console.log('文件存在');
    }
  });
```

#### fsPromises.appendFile(path, data[, options])

- path `<string> | <Buffer> | <URL> | <FileHandle>` 文件名或 `<FileHandle>`
- data `<string> | <Buffer>`
- options `<Object> | <string>`
    - encoding `<string> | <null>` 默认值：'utf8'
    - mode `<integer>` 默认值：0o666,mode 选项仅影响新创建的文件。
    - flag `<string>` 参见 支持文件系统 flags。默认值：'a'。
    - flush `<boolean>` 如果是 true，则在关闭基础文件描述符之前将其刷新。默认值：false。
- 返回：`<Promise>` 成功时将使用 undefined 履行。

异步地将数据追加到文件，如果该文件尚不存在，则创建该文件。data 可以是字符串或 `<Buffer>`。
如果 options 是字符串，则它指定 encoding。
可以将 path 指定为已打开用于追加（使用 fsPromises.open()）的 `<FileHandle>`。

```js
fs.appendFile('./node/file.text', 'hello world!', (err) => {
    if(err) {
        console.error('追加数据到文件时发生错误:', err);
        return
    }
    console.log('数据已成功追加到文件');
})
```

#### fsPromises.copyFile(src, dest[, mode])

- src `<string> | <Buffer> | <URL>` 要复制的源文件名
- dest `<string> | <Buffer> | <URL> `复制操作的目标文件名
- mode `<integer>` 指定复制操作行为的可选修饰符。可以创建一个由两个或多个值的按位或组成的掩码（例如 fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE）默认值：0。
    - fs.constants.COPYFILE_EXCL：如果 dest 已经存在，则复制操作将失败。
    - fs.constants.COPYFILE_FICLONE：复制操作将尝试创建写时复制引用链接。如果平台不支持写时复制，则使用后备复制机制。
    - fs.constants.COPYFILE_FICLONE_FORCE：复制操作将尝试创建写时复制引用链接。如果平台不支持写时复制，则该操作将失败。
- 返回：`<Promise>` 成功时将使用 undefined 履行。

异步地将 src 复制到 dest。默认情况下，如果 dest 已经存在，则会被覆盖。
无法保证复制操作的原子性。如果在打开目标文件进行写入后发生错误，则将尝试删除目标文件。

```js
fs.copyFile('./node/file.text', './node/copy-file.text', (err) => {
    if(err){
        console.error('copy err: >>', err)
    }
})
```

#### fsPromises.lchmod(path, mode)

更改符号链接的权限。

#### fsPromises.lchown(path, uid, gid)

更改符号链接上的所有权。

#### fsPromises.lutimes(path, atime, mtime)

以与 fsPromises.utimes() 相同的方式更改文件的访问和修改时间，不同之处在于如果路径引用符号链接，则该链接不会取消引用：相反，符号链接本身的时间戳被改变了。

#### fsPromises.link(existingPath, newPath)

- existingPath `<string> | <Buffer> | <URL>`
- newPath `<string> | <Buffer> | <URL>`
- 返回：`<Promise>` 成功时将使用 undefined 履行。

用于创建硬链接。创建从 existingPath 到 newPath 的新链接。

#### fsPromises.readlink(path[, options])

读取 path 引用的符号链接的内容

#### fsPromises.realpath(path[, options])

#### fsPromises.lstat(path[, options])

等效于 fsPromises.stat()，除非 path 指向符号链接，在这种情况下，被统计的是链接本身，而不是其所引用的文件。

#### fsPromises.mkdir(path[, options])

- path `<string> | <Buffer> | <URL>`
- options `<Object> | <integer>`
    - recursive `<boolean> `默认值：false
    - mode `<string> | <integer>` Windows 上不支持。默认值：0o777。
- 返回：`<Promise> `成功后，如果 recursive 为 false，则使用 undefined 履行；如果 recursive 为 true，则使用创建的第一个目录路径履行。

异步地创建目录。

可选的 options 参数可以是指定 mode（权限和粘性位）的整数，也可以是具有 mode 属性和 recursive 属性（指示是否应创建父目录）的对象。当 path 是已存在的目录时，调用 fsPromises.mkdir() 仅在 recursive 为 false 时才导致拒绝。

#### fsPromises.mkdtemp(prefix[, options])

#### fsPromises.open(path, flags[, mode])

- path `<string> | <Buffer> | <URL>`
- flags `<string> | <number>` 参见 支持文件系统 flags。默认值：'r'。
- mode `<string> | <integer>` 如果创建文件，则设置文件模式（权限和粘性位）。默认值：0o666（可读可写）
- 返回：`<Promise> 使用 <FileHandle>` 对象实现。

如 命名文件、路径、以及命名空间 所述，某些字符 (< > : " / \ | ? *) 在 Windows 下是保留的。在 NTFS 下，如果文件名包含冒号，Node.js 将打开文件系统流，如 这个 MSDN 页面 所述。

#### fsPromises.opendir(path[, options])

异步地打开目录进行迭代扫描

#### fsPromises.readdir(path[, options])

读取目录的内容。

```js
fs.readdir('./node', (err, files) => {
    if (err) {
      console.error('读取目录时发生错误:', err);
      return;
    }
  
    // 打印目录中的文件和子目录的名称
    console.log('目录中的文件和子目录:', files);
  });
```

#### fsPromises.rename(oldPath, newPath)

#### fsPromises.rmdir(path[, options])

- path `<string> | <Buffer> | <URL>`
- options `<Object>`
    - maxRetries `<integer>` 如果遇到 EBUSY、EMFILE、ENFILE、ENOTEMPTY 或 EPERM 错误，Node.js 将在每次尝试时以 retryDelay 毫秒的线性退避等待时间重试该操作。此选项表示重试次数。如果 recursive 选项不为 true，则忽略此选项。默认值：0。
    - recursive `<boolean>` 如果为 true，则执行递归目录删除。在递归模式下，操作将在失败时重试。默认值：false。已弃用。
    - retryDelay `<integer>` 重试之间等待的时间（以毫秒为单位）。如果 recursive 选项不为 true，则忽略此选项。默认值：100。
- 返回：`<Promise>` 成功时将使用 undefined 履行。

删除由 path 标识的目录。

在文件（而不是目录）上使用 fsPromises.rmdir() 会导致 promise 被拒绝，在 Windows 上使用 ENOENT 错误，在 POSIX 上使用 ENOTDIR 错误。

要获得类似于 `rm -rf` Unix 命令的行为，则使用具有选项` { recursive: true, force: true } `的 fsPromises.rm()

#### fsPromises.rm(path[, options])

删除文件和目录（在标准 POSIX rm 实用工具上建模）。

#### fsPromises.statfs(path[, options])

#### fsPromises.symlink(target, path[, type])

#### fsPromises.truncate(path[, len])

#### fsPromises.unlink(path)

如果 path 指向符号链接，则删除该链接，但不影响链接所指向的文件或目录。如果 path 指向的文件路径不是符号链接，则删除文件

#### fsPromises.utimes(path, atime, mtime)

更改 path 引用的对象的文件系统时间戳。

#### fsPromises.watch(filename[, options])

返回异步迭代器，其监视 filename 上的更改，其中 filename 是文件或目录。

#### fsPromises.constants

返回一个包含文件系统操作常用常量的对象。对象与 fs.constants 相同

#### fs.close(fd[, callback])

关闭文件描述符。除了可能的异常之外，没有为完成回调提供任何参数。