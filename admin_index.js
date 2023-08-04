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

client.on("message",  async (message) => {
    const chatId = message.chat.id;
    const msgText = message.text;

    if (msgText === '' || null || undefined || NaN)
        console.log("no request")
    if (msgText === "/start")
        console.log("Рита в здании")
    if (msgText === "$send")
        client.sendMessage(chatId, await fsys.sendMailFromStorage()).then(r => {
            console.log(`?sent \n ${r}`);
        });
    if (msgText === "$check")
        await client.sendMessage(chatId,
            fsys.checkOrderPackage())
    // if (msgText === "$help")
    //     await client.sendMessage(chatId,
    //         handler.onHelpRequired("adm"))
    else
        await client.sendMessage(chatId, "??no_command")
});