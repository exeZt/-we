const TelegramBot = require('node-telegram-bot-api'),
      config = require("./config.json"),
      handler = require("./lib/handlers"),
      prefix = config.prefix,
      key = config.key.client.full,
      storage = require("./lib/local_storage/filesystem");

const client = new TelegramBot(key, {
    polling: true,
});

client.on("message",  async (message) => {
    const chatId = message.chat.id;
    const msgText = message.text;
    if (msgText === "/start")
        console.log("a")
    else {
        let finalData = await handler.onCreatePackage((msgText.replace('$$send', '').trim().replace('/start', '').trim())
            .replace('$send' || '/start' || '/help', '').trim().trimEnd())
        client.sendMessage(chatId, finalData)
            .then(() => storage.createOrdersFile(finalData))
        client.onReplyToMessage(chatId, message.message_id, function () {
            console.log("approved");
        });
    }
});

client.onText(/\/help/, (msg) => {
    client.sendMessage(msg.chat.id, "")
        .then(r => console.log(Promise));
});