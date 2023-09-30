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
    Admin = require('./lib/admin')
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
    SecuritySystem.isBanned(msg.from.username, async function (result) {
        console.log(result)
        if (result === true) {
            console.trace(`USER ${msg.from.username} is banned, history will be cleared`)
            await client.sendMessage(msg.chat.id, `Руденко, пошел нахуй отсюда ${msg.from.username}`)
            setTimeout(async () => {
                let k = 0;
                for (let i = 0; i <= 200; i++) {
                    try {
                        k = msg.message_id - i
                        console.log(msg.message_id)
                        await client.deleteMessage(msg.chat.id, k)
                    } catch (e) {
                        console.log(e)
                    }
                }
            }, 2000)
        } else {
            for (const u of JSON.parse(SecuritySystem.getDataAuth_user())) {
                if (msg.from.username === u) {
                    console.log(true)
                    if (msg.text === '/logrender') {
                        await client.sendDocument(msg.chat.id.toString(), DataHandler.getRenderLog(msg.from.username, msg.from.id, msg.message_id, getDate()))
                    }
                    else if (msg.text === '/getbanlist') {
                        SecuritySystem.isAdmin(msg.from.username, async function (result) {
                            if (result === true)
                                try{
                                    await client.sendMessage(msg.chat.id, Admin._getbanlist().content.toString())
                                }catch (e) {
                                    try {
                                        await client.sendDocument(msg.chat.id, Admin._getbanlist().path)
                                    } catch (e) {
                                        await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                                    }
                                }
                        })
                    }
                    else if (msg.text === '/getmemberslist') {
                        SecuritySystem.isAdmin(msg.from.username, async function (result) {
                            if (result === true)
                                try{
                                    await client.sendMessage(msg.chat.id, Admin._getmemberslist().content.toString())
                                }catch (e) {
                                    try {
                                        await client.sendDocument(msg.chat.id, Admin._getmemberslist().path)
                                    } catch (e) {
                                        await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                                    }
                                }
                        })
                    }
                    else if (msg.text === '/getadminslist') {
                        SecuritySystem.isAdmin(msg.from.username, async function (result) {
                            if (result === true)
                                try {
                                    await client.sendMessage(msg.chat.id, Admin._getadminlist().content.toString())
                                } catch (e) {
                                    try {
                                        await client.sendDocument(msg.chat.id, Admin._getadminlist().path)
                                    } catch (e) {
                                        await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении файла')
                                    }
                                }
                        })
                    }
                    else if (msg.text === '/getfileslist') {
                        SecuritySystem.isAdmin(msg.from.username, async function (result) {
                            if (result === true)
                                try {
                                    await client.sendMessage(msg.chat.id, Admin._getfilelist().content.toString())
                                } catch (e) {
                                    await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении данных')
                                }
                        })
                    }
                    else if (msg.text === '/help') {
                        await client.sendMessage(msg.chat.id, Admin._help())
                    }
                    else if (msg.text === '/cls') { /** works */
                        SecuritySystem.isAdmin(msg.from.username, function (result) {
                            if (result === true)
                                console.clear();
                        })
                    }
                    else await DataHandler.responseRenderer(msg.text, async function (d) {
                        console.trace(isKeyBoard(await d))
                        if (isKeyBoard(await d)) {
                            console.log(d)
                            client.sendMessage(msg.chat.id, msg.text, await d)
                                .then(() => client.deleteMessage(msg.chat.id, msg.message_id))
                                .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                                .then(() => console.trace(`message ${msg.message_id} gotten keyboard response`))
                        } else {
                            client.sendMessage(msg.chat.id, await d)
                                .then(() => console.trace(`message ${msg.message_id} gotten default response`))
                                .then(() => DataHandler.callFileFromRenderer(msg.text, function (res) {
                                    console.log(res)
                                    try {
                                        client.sendDocument(msg.chat.id, res)
                                    } catch (e) {
                                        console.log('err')
                                    }
                                }));
                        }
                    })
                }
            }
        }
    })
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