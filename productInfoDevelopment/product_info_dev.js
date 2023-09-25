const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    ls = require("./local_app_storage.json"),
    fs = require("fs"),
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.prod_info.full,
    storage = require("./lib/local_storage/filesystem"),
    SecuritySystem = require('./lib/security')
    DataHandler = require("./lib/datahander"),
    {callbackPromise} = require("nodemailer/lib/shared"),
    client = new TelegramBot(key, {
        polling: true,
    });

global.XMLHttpRequest = require('xhr2');
SecuritySystem.getUdata();
setInterval(() => SecuritySystem.getDataAuth_user(), 30000)

client.on('message', async function (msg) {
    console.log('message-received: [')
        console.log(msg.from)
    console.log(']')
    for (const u of JSON.parse(SecuritySystem.getDataAuth_user())) {
        if (msg.from.username === u){
            console.log(true)
            if (msg.text === '/logrender'){
                await client.sendDocument(msg.chat.id.toString(), DataHandler.getRenderLog(msg.from.username, msg.from.id, msg.message_id, getDate()))
            }
            else await DataHandler.responseRenderer(msg.text, async function (d) {
                console.trace(isKeyBoard(await d))
                if (isKeyBoard(await d)){
                    console.log(d)
                    client.sendMessage(msg.chat.id, msg.text , await d)
                        .then(() => client.deleteMessage(msg.chat.id, msg.message_id))
                        .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                        .then(() => console.trace(`message ${msg.message_id} gotten keyboard response`))

                }else {
                    console.log(await d)
                    client.sendMessage(msg.chat.id, await d)
                        .then(() => console.trace(`message ${msg.message_id} gotten default response`))
                }
            })
        }
    }
})

function isKeyBoard (raw) {
    try {
        if (raw !== 'Promise { <pending> }'){
            JSON.stringify(raw).toString()
            if (JSON.stringify(raw).startsWith('{'))
                return true
            else
                return false
        }
    }catch (e) {
        return false
    }
}

function getDate() {
    let a = new Date();
    return `date: ${a.getFullYear()}|${a.getMonth()}|${a.getDay()} time: ${a.getHours()}:${a.getMinutes()}:${a.getSeconds()}`
}