const TelegramBot = require('node-telegram-bot-api'),
client = new TelegramBot('6366098811:AAGcfYgnzw0bjm7p3N1Yc81pLJ52Zg3RSrk', {
    polling: true,
});
global.XMLHttpRequest = require('xhr2');

client.on('message', async function (msg) {
    await client.sendMessage(msg.chat.id, msg.video.file_id)
})