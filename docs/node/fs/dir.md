---
outline: deep
---

## fs.Dir

表示目录流的类。

由 fs.opendir()、fs.opendirSync() 或 fsPromises.opendir() 创建

### dir.close()

异步地关闭目录的底层资源句柄。后续读取将导致错误。

返回一个 promise，该 promise 将在资源关闭后履行。

>dir.close(callback)\dir.closeSync()

### dir.path

- `<string>`

提供给 fs.opendir()、fs.opendirSync() 或 fsPromises.opendir() 的此目录的只读路径。

### dir.read()

返回一个 promise，如果没有更多的目录条目可供读取，则将通过 `<fs.Dirent>` 或 null 来实现。

此函数返回的目录条目没有操作系统底层目录机制提供的特定顺序。迭代目录时添加或删除的条目可能不包括在迭代结果中。

>dir.read(callback)/dir.readSync()

### dir[Symbol.asyncIterator]()

异步地遍历目录，直到读取了所有条目。

## fs.Dirent

目录条目的表示，可以是目录中的文件或子目录，通过从 `<fs.Dir>` 读取返回。目录条目是文件名和文件类型对的组合。
此外，当在 withFileTypes 选项设置为 true 的情况下调用 fs.readdir() 或 fs.readdirSync() 时，生成的数组将填充 `<fs.Dirent>` 对象，而不是字符串或 `<Buffer>`。

### dirent.isBlockDevice()

### dirent.isCharacterDevice()

### dirent.isDirectory()

### dirent.isFIFO()

### dirent.isFile()

### dirent.isSocket()

### dirent.isSymbolicLink()

### dirent.name

### dirent.path

## fs.FSWatcher

每当修改指定的被监视文件时，所有 `<fs.FSWatcher>` 对象都会触发 'change' 事件。

### event: close/change/error

### watcher.close()

### watcher.ref()

### watcher.unref()

## fs.StatWatcher

### watcher.ref()

### watcher.unref()

## fs.ReadStream

### event: close/open/ready

### readStream.bytesRead

到目前为止已读取的字节数。

### readStream.path

流正在读取的文件的路径，如 fs.createReadStream() 的第一个参数中所指定。如果 path 作为字符串传入，则 readStream.path 将是字符串。如果 path 作为 `<Buffer>` 传入，则 readStream.path 将是 `<Buffer>`。如果指定了 fd，则 readStream.path 将是 undefined。

### readStream.pending

如果底层文件尚未打开，即在触发 'ready' 事件之前，则此属性为 true。

## fs.Stats

对象提供有关文件的信息。

从 fs.stat()、fs.lstat()、fs.fstat() 及其同步对应对象返回的对象属于此类型。如果传给这些方法的 options 中的 bigint 为 true，则数值将为 bigint 而不是 number，并且该对象将包含额外的以 Ns 为后缀的纳秒精度属性。

### stats.isBlockDevice()

### stats.isCharacterDevice()

### stats.isDirectory()

### stats.isFIFO()

### stats.isFile()

### stats.isSocket()

### stats.isSymbolicLink()

### stats.dev

### stats.ino

### stats.mode

### stats.nlink

### stats.uid

### stats.gid

### stats.rdev

### stats.size

### stats.blksize

### stats.blocks

### stats.atimeMs[mtimeMs\ctimeMs\birthtimeMs\atimeNs\mtimeNs\ctimeNs\birthtimeNs\atime\mtime\ctime\birthtime]