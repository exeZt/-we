"use strict";
const TelegramBot = require('node-telegram-bot-api'),
    config = require("../config.json"),
    handler = require("../lib/handlers"),
    prefix = config.prefix,
    key = config.key.admin.full,
    fsl = require("./adm_file");

const client = new TelegramBot(key, {
    polling: true,
});

client.on("message",  async (message) => {
    const chatId = message.chat.id;
    const msgText = message.text;

    if (msgText === "/start")
        console.log("Рита в здании")
    if (msgText === "$send")
        client.sendMessage(chatId, fsl.sendMailFromStorageAdmin()).then(r => {
            console.log(`?sent \n ${r}`);
        });
    if (msgText === "$check")
        await client.sendMessage(chatId,
            fsl.checkOrderPackageAdmin().trim())
    if (msgText === "$help")
        await client.sendMessage(chatId,
            handler.onHelpRequired())
});

client.onText(/\/help/, (msg) => {
    client.sendMessage(msg.chat.id, "")
        .then(r => console.log(Promise));
});