const express = require('express')
const bodyParser = require('body-parser')
const line = require('@line/bot-sdk');

require('dotenv').config()
const accessToken = process.env.accessToken

const client = new line.Client({
    channelAccessToken: accessToken
});

const app = express()
async function bootstrap() {
    const port = process.env.PORT || 3080
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    await app.listen(port)
    console.log('line sdk start at: ' + port)
}
bootstrap()

app.post('/line', (req, res) => {
    const event = req.body.events[0]
    const reply_token = event.replyToken
    // console.log('source', event.source)
    // source {
    //     userId: 'U4472db5857c2b9564e8985ebc38f5573',
    //     groupId: 'Ca6eb81c7b266f30d97eec8a92d033c42',
    //     type: 'group'
    //   }
    if (event.type == 'message') { // && event.source.type != 'group'
        replyMessage(reply_token, event.message.text)
    } else {
        console.log(event.type)
    }
    res.sendStatus(200)
})

app.post('/push', async (req, res) => {
    const body = req.body
    const data = await pushMessage(body.uid, body.message)
    res.json({ res: data })
})

app.post('/reply', async (req, res) => {
    const body = req.body
    const data = await replyMessage(body.token, body.message)
    res.json({ res: data })
})

async function replyMessage(reply_token, text) {
    const message = {
        type: 'text',
        text: text
    };
    try {
        const data = await client.replyMessage(reply_token, message)
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}

async function pushMessage(id, text) {
    const message = {
        type: 'text',
        text: text
    };
    try {
        const data = await client.pushMessage(id, message)
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}