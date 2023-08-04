const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    ls = require("./local_app_storage.json");
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.prod_info.full,
    storage = require("./lib/local_storage/filesystem");

const client = new TelegramBot(key, {
    polling: true,
});

client.on("message",  async (message) => {

});
var options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'КК1', callback_data: '1' }],
            [{ text: 'КК2', callback_data: '2' }],
            [{ text: 'ДК' , callback_data: '3' }],
            [{ text: 'КЛ' , callback_data: '4' }],
            [{ text: 'Мотивация', callback_data: '5' }]
        ]
    })
};

/**
 * @param KK1 : 1
 * @param KK2 : 2
 * @param DK : 3
 * @param KL : 4
 * @param MotUI : 5
 * */

client.onText(/\/start/, function (msg, match) {
    console.log(msg.chat.id)
    client.sendMessage(msg.chat.id, 'Выберите продукт:', options)
        .then(r => console.log(r));
});
client.on('callback_query', async function (msg) {
    let answer = await msg.data;
    let id = msg.chat.id
    console.log(answer)
    console.log(ls.prod_info[1])
    let ans = ls.prod_info[1];
console.log(id)
    client.answerCallbackQuery(msg.id, ans, true)
        .then(r =>  client.sendMessage(id, r)
            .then((r) => console.log(r)))
});