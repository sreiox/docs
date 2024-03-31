const http = require("node:http")
const fs = require('fs');
const mammoth = require('mammoth')
const url = require('url');


// fs.appendFile('./node/file.text', 'hello world!', (err) => {
//     if(err) {
//         console.error('追加数据到文件时发生错误:', err);
//         return
//     }
//     console.log('数据已成功追加到文件');
// })
// 辅助函数，将权限值转换为权限字符串
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

// fs.chmod('./node/file.text', 0o755, (err) => {
//     if (err) {
//         console.error('更改文件权限时发生错误:', err);
//         return;
//       }
//       console.log('文件权限已成功更改');
// })


// fs.open('./node/file.doc', (err, fd) => {
//     if(err){
//         console.error('文件打开时错误', err)
//         return
//     }

//     const buffer = Buffer.alloc(1024)
//     console.log(`fd:>>${fd}`)
//     fs.read(fd, buffer, 0, buffer.length, 0, async (err, bytesread, buffer) => {
//         if(err){
//             console.error('文件读取时发生错误', err)
//             return
//         }
        
//         //打印实际读取的字节数
//         console.log('实际读取的字节数', buffer.toString('utf8', 0, bytesread))
//         console.log('读取的内容', con)

//         const createWriteStream = fs.createWriteStream('./node/file.text', { encoding: 'utf-8'})
//         createWriteStream.write(buffer.toString('utf8', 0, bytesread))
//         createWriteStream.end()
//         createWriteStream.on('finish', () => {
//             console.error('数据写入完成')
//         })
//         createWriteStream.on('error', (err) => {
//             if(err){
//                 console.error('数据写入时发生错误', err)
//                 return
//             }
//         })


//         fs.close(fd, (err) => {
//             if(err){
//                 console.error('关闭文件时发生错误', err)
//             }
//         })
//     })

// })

// 读取 .doc 文件
// fs.readFile("./node/file.text", 'utf8', (err, data) => {
//     if (err) {
//       console.error("读取文件时发生错误:", err);
//       return;
//     }
  
//     console.log(data)
//   });

fs.access('./node/file.doc', fs.constants.R_OK, (err) => {
    if (err) {
      console.error('文件不存在');
    } else {
      console.log('文件存在');
    }
  });

// fs.copyFile('./node/file.text', './node/copy-file.text', (err) => {
//     if(err){
//         console.error('copy err: >>', err)
//     }
// })

fs.readdir('./node', (err, files) => {
    if (err) {
      console.error('读取目录时发生错误:', err);
      return;
    }
  
    // 打印目录中的文件和子目录的名称
    console.log('目录中的文件和子目录:', files);
  });

const server = http.createServer((req, res) => {

    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*'})

    if(req.url === '/getstream'){
        // console.log(url.parse(req.url, true).query)
        // 创建可读流
        const readableStream = fs.createReadStream('./node/file.text', { encoding: 'utf8'});

        // 监听 data 事件来处理数据
        readableStream.on('data', (chunk) => {
            console.log('接收到数据:', chunk);
            res.end(chunk)
        });

        // 监听 end 事件来处理读取结束
        readableStream.on('end', () => {
            console.log('文件读取结束');
        });
        
    }else if(req.method === 'POST' && req.url === '/poststream'){
        var stream = ''

        // 监听请求数据的传输
        req.on('data', (chunk) => {
            console.log('chunk', chunk)
            stream += chunk;
        });
        req.on('end', () => {
            // 将接收到的数据解析为 JSON 对象
            const jsonData = JSON.parse(stream);

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
            res.end(JSON.stringify(jsonData));
        });
        
    }else if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400', // 预检请求的有效期，单位为秒
        });
        res.end('options');
      }else{

        // res.end(Buffer.from(data, 'utf-8'));
        res.end('返回数据')

    }
})

const req = http.get({host: '127.0.0.1', port: 3030, path: '/get', body: { type: 'get' } }, (res) => {

  res.on('date', (chunk)=>{
    console.log('获取参数', chunk)
  })
})

req.end()

server.listen(3031, '127.0.0.1', ()=>{
    console.log('server start')
})