const WebSocket = require('ws')

// interface sendType {
//     type: number, //1: 同步在线用户   2: 用户消息  3：:未读消息
//     uuid: string | null,
//     connect_uuid: string | null,
//     message: string | null,
//     user_list: string | null
// }
// 创建websocket服务
const wss = new WebSocket.Server({port: 3030, host: '0.0.0.0'})
const user_list = [{name: '', uuid: '', unread: 0}]
const historyMessage = new Map()
historyMessage.set('', [])
// 监听连接事件
wss.on('connection', function connection(ws){
    console.log('client connected')
    // 监听消息事件
    ws.on('message', function incoming(msg){
        console.log(`received: %s`, JSON.parse(msg))
        const receMsg = JSON.parse(msg)
        if(receMsg.type == 1){
            const uuids = user_list.map(item => item.uuid)
            if(uuids.indexOf(receMsg.user.uuid) < 0)user_list.push(receMsg.user)
        }

        let getMessageList = ''
        if(receMsg.type == 2){
            const uuidStr = receMsg.connUser.uuid && receMsg.user.uuid? receMsg.connUser.uuid+'_'+receMsg.user.uuid: ''
            const uuidStr2 = receMsg.connUser.uuid && receMsg.user.uuid? receMsg.user.uuid+'_'+receMsg.connUser.uuid: ''
            if(historyMessage.has(uuidStr)){
                const messageItem = historyMessage.get(uuidStr)
                messageItem.push(receMsg)
                historyMessage.set(uuidStr, messageItem)
                getMessageList = messageItem
            }else if(historyMessage.has(uuidStr2)){
                const messageItem = historyMessage.get(uuidStr2)
                messageItem.push(receMsg)
                historyMessage.set(uuidStr2, messageItem)
                getMessageList = messageItem
            }else{
                historyMessage.set(uuidStr, [receMsg])
            }
        }
        // 向所有客户端发送消息
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if(receMsg.type == 1)client.send(JSON.stringify({type: 1, user_list}))
                if(receMsg.type == 2 ){
                    const array = Array.from(historyMessage, ([key, value]) => ({ key, value }));
                    console.log(historyMessage, array)
                    client.send(JSON.stringify({type: 2, messageList: array}))
                    client.send(JSON.stringify({type: 3, uuid: receMsg.user.uuid, connUuid: receMsg.connUser.uuid}))
                }
            }
        });
        
    })

    ws.on('close', (code, reason) => {
        console.log('close')
        // ws.close();
    })

    ws.on('error', (err) => {
        console.log(err)
    })

    // 发送消息
    ws.send('hello client')
    // 发送群聊
    if(historyMessage.size){
        const array = Array.from(historyMessage, ([key, value]) => ({ key, value }));
        ws.send(JSON.stringify({type: 2, messageList: array}))
    }
})