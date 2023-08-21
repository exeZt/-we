"use strict";
const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.admin.full,
    fsys = require("./lib/local_storage/filesystem");

const client = new TelegramBot(key, {
    polling: true,
});

const allowList = {
    "admin_list" : [
        "904894186"
    ]
}

client.onText(/\/start/, async (msg) => {
    console.log(msg.from.id);
    const chatId = msg.chat.id;
    const msgText = msg.text;
    allowList.admin_list.forEach(admin => {
        console.log(admin.toString())
        if (admin.toString() === msg.from.id.toString())
        {
            client.on("message",  async (message) => {
                const chatId = message.chat.id;
                const msgText = message.text;


                if (msgText === "/start")
                    console.log("Рита в здании")
                if (msgText === "$send")
                    client.sendMessage(chatId, await fsys.sendMailFromStorage()).then(r => {
                        console.log(`?sent \n ${r}`);
                    });
                if (msgText === "$check")
                    await client.sendMessage(chatId,
                        fsys.checkOrderPackage())
                if (msgText === '' || null || undefined || NaN)
                    console.log("no request")
                    // if (msgText === "$help")
                    //     await client.sendMessage(chatId,
                //         handler.onHelpRequired("adm"))
                else
                    await client.sendMessage(chatId, "??no_command")
            });
        }
        else {
            console.log(false);
        }
    })
    await client.sendMessage(chatId, msg.from.id)
});