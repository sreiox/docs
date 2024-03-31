const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
});


app.get('/', (req, res) => {
    res.append('Access-Control-Allow-Origin', '*')
    res.send('默认返回的数据')
})

app.get('/api/list', async (req, res) => {
    res.append('Access-Control-Allow-Origin', '*')
    res.append('Access-Control-Allow-Content-Type', '*')

    let result = await axios.get('http://127.0.0.1:8080/get')

    res.send(result.data)

})

app.post('/api/listpost', async (req, res) => {
    res.append('Access-Control-Allow-Origin', '*')
    res.append('Access-Control-Allow-Content-Type', '*')
    const requestData = req.body;
    let result = await axios.post('http://127.0.0.1:8080/post', requestData, {headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置 Content-Type
      },})
    console.log(req.body)

    res.send(result.data)

})



app.listen(3000, '0.0.0.0', () => {
    console.log('serve start')
})