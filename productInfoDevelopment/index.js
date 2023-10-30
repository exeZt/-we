const TelegramBot = require('node-telegram-bot-api'),
    fs = require("fs"),
    { Key, telegramSettings} = require("./lib/config"),
    SecuritySystem = require('./lib/security')
const {getMotivation} = require("./lib/extra");
DataHandler = require("./lib/datahander"),
    Admin = require('./lib/admin')
client = new TelegramBot(Key, {
    polling: true,
})

global.XMLHttpRequest = require('xhr2');
SecuritySystem.getUdata();

setInterval(() => SecuritySystem.getDataAuth_user(), 30000)

client.on('message', async function (msg) {
    SecuritySystem.isAdmin(msg.from.username, async function (result) { /** works */
        if (result === true)
            try{
                    await client.sendMessage(msg.chat.id,`${msg.video.file_id} ID видео, для вставки в поле с видео`)
            }catch (e) {
                console.log(e)
            }
    })
    console.log('message-received: [')
    console.log(msg.from)
    console.log(']')
    // await DataHandler.logger({
    //     user_info: msg.from,
    //     user_name: msg.from.username,
    //     user_query: msg.text,
    //     user_response: !0
    // })
    SecuritySystem.isBanned(msg.from.username, async function (result) {
        console.log(result)
        if (result === true) { /** works */
        console.trace(`USER ${msg.from.username} is banned, history will be cleared`)
            await client.sendMessage(msg.chat.id, `_banned ${msg.from.username}`)
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
                if (msg.from.username === u) { /** works */
                    console.log(true)
                    if (msg.text === '/logrender') {
                        await client.sendDocument(msg.chat.id.toString(), DataHandler.getRenderLog(msg.from.username, msg.from.id, msg.message_id, getDate()))
                    }
                    else if (msg.text === '/getbanlist') { /** works */
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
                    else if (msg.text === '/getmemberslist') { /** works */
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
                    else if (msg.text === '/getadminslist') { /** works */
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
                    else if (msg.text === '/getfileslist') { /** works */
                        SecuritySystem.isAdmin(msg.from.username, async function (result) {
                            if (result === true)
                                try {
                                    await client.sendMessage(msg.chat.id, Admin._getfilelist().content.toString())
                                } catch (e) {
                                    await client.sendMessage(msg.chat.id, 'Произошла ошибка при получении данных')
                                }
                        })
                    }
                    else if (msg.text === '/help') { /** works */
                        await client.sendMessage(msg.chat.id, Admin._help())
                    }
                    else if (msg.text === '/cls') { /** works */
                        SecuritySystem.isAdmin(msg.from.username, function (result) {
                            if (result === true)
                                console.clear();
                        })
                    }
                    else if (msg.text === '/ref') { /** works */
                        SecuritySystem.isAdmin(msg.from.username, function (result) {
                            if (result === true)
                                Admin._refresh_data();
                        })
                    }
                    else if ("/getlog" === msg.text){
                         SecuritySystem.isAdmin(e.from.username, async function(t) {
                            if (!0 === t) try {
                                await client.sendDocument(msg.chat.id, DataHandler.getlog())
                            } catch (a) {
                                try {
                                    await client.sendDocument(msg.chat.id, Admin._getmemberslist().path)
                                } catch (s) {
                                    await client.sendMessage(msg.chat.id, "Произошла ошибка при получении файла")
                                }
                            }
                        })
                    }
                    else await DataHandler.responseRenderer(msg.text, async function (d) {
                        if (isKeyBoard(await d)) {
                            console.log(d)
                            client.sendMessage(msg.chat.id, msg.text, await d)
                                .then(() => client.deleteMessage(msg.chat.id, msg.message_id))
                                .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                        } else {
                            client.sendMessage(msg.chat.id, await d, {
                                parse_mode: telegramSettings.parse_mode
                            })
                            .then(() => console.trace(`message ${msg.message_id} gotten default response`))
                            .then(() => DataHandler.callFileFromRenderer(msg.text, function (res) {
                                console.log(res)
                                try {
                                    client.sendDocument(msg.chat.id, res)
                                } catch (e) {
                                    console.log('err caught when tries send doc')
                                }
                            }))
                            try {
                                await DataHandler.callMediaFromRenderer(msg.text, async function (res) {
                                    try {
                                        console.trace(res)
                                        await client.sendVideo(msg.chat.id, res);
                                    } catch (e) {
                                        console.log('err caught when tries send video');
                                    }
                                })
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    })
                }
            }
        }
    })
})

function isKeyBoard (raw) { /** works */
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

function getDate() { //formatted /** works */
    let a = new Date();
    return `date: ${a.getFullYear()}|${a.getMonth()}|${a.getDay()} time: ${a.getHours()}:${a.getMinutes()}:${a.getSeconds()}`
}