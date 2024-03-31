const http = require('node:http')
const net = require('node:net');
const { URL } = require('node:url');

const hostname = '127.0.0.1'
const port = 3030
console.log(http.STATUS_CODES)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});

    if(req.url === '/agent'){
        agentWarpper()
        res.end()
    }else if(req.url === '/get'){
        console.log('getHeaders')
        res.on('data', (chunk) => {
            console.log('获取到数据', chunk)
        })
        res.write('模拟get请求')
        res.socket.setTimeout(1000, ()=>{
            console.log('res.socket.setTimeout')
        })
        res.end()
    }else{
        res.writeHead(200, {'Content-Type': 'text/plain', 'content-length': 10})
        // console.log(Buffer.byteLength('hello world!'))
        // res.on('close', () => {
        //     console.log('终止请求')
        // })
        // 发送 "100 Continue" 响应
        res.writeContinue();
        res.end('hello world!')
    }
    console.log(res.statusCode, req.statusCode)
    req.on('information', (info) => {
        console.log(`Got information prior to main response: ${info.statusCode}`);
    });

    // 处理错误
    req.on('error', (error) => {
        console.error(`请求错误: ${error.message}`);
    });
    
})
  


// 创建一个自定义的 http.Agent 对象
const customAgent = new http.Agent({
    maxFreeSockets: 10,  //最大并发
    keepAlive: true, //是否启用
    keepAliveMsecs: 1000 //keep-alive时间
})

function agentWarpper(){
    const req = http.get({hostname: '192.168.124.6', port: 3000, path: '/', agent: customAgent}, res => {
        // 接收响应数据
        res.on('data', (chunk) => {
            console.log(`响应数据: ${chunk}`);
            console.log(customAgent.getName('family'))
        });
        // 响应结束
        res.on('end', () => {
            console.log('响应结束');
        });
    })
    // 处理错误
    req.on('error', (error) => {
        console.error(`请求错误: ${error.message}`);
    });
    
    // 结束请求
    req.end();
}

// server.on('connect', (req, clientSocket, head) => {
//     // Connect to an origin server
//     const { port, hostname } = new URL(`http://${req.url}`);
//     const serverSocket = net.connect(port || 80, hostname, () => {
//       clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
//                       'Proxy-agent: Node.js-Proxy\r\n' +
//                       '\r\n');
//       serverSocket.write(head);
//       serverSocket.pipe(clientSocket);
//       clientSocket.pipe(serverSocket);
//     });
//   });

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// 监听 connection 事件
server.on('connection', (socket) => {
    console.log('客户端连接已建立');
    
    // 在这里可以执行一些与连接相关的逻辑
    // 例如记录连接数、跟踪连接的状态等
  });

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)

    // const options = {
    //     port,
    //     host: hostname,
    //     method: 'CONNECT',
    //     path: 'www.google.com:80',
    //   };
    
    //   const req = http.request(options);
    //   req.end();
    
    //   req.on('connect', (res, socket, head) => {
    //     console.log('got connected!');
    
    //     // Make a request over an HTTP tunnel
    //     socket.write('GET / HTTP/1.1\r\n' +
    //                  'Host: www.google.com:80\r\n' +
    //                  'Connection: close\r\n' +
    //                  '\r\n');
    //     socket.on('data', (chunk) => {
    //       console.log(chunk.toString());
    //     });
    //     // 处理错误
    //     socket.on('error', (error) => {
    //         console.error(`请求错误: ${error.message}`);
    //     });
    //     socket.on('end', () => {
    //         server.close();
    //     });
    //   });
})

