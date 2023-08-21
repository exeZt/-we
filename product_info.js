const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    ls = require("./local_app_storage.json"),
    fs = require("fs"),
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.prod_info.full,
    storage = require("./lib/local_storage/filesystem");

const client = new TelegramBot(key, {
    polling: true,
});

client.on("message",  async (message) => {

});
const options = {
    parse_mode: "Markdown",
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'КК 60 дней без %', callback_data: '1', action : 'one' }],
            [{ text: 'Дебетовая карта', callback_data: '2', action : 'two' }],
            [{ text: 'Автокредит' , callback_data: '3', action : 'three' }],
            [{ text: 'Ипотека' , callback_data: '4', action : 'four' }],
            [{ text: 'Кредитный лимит' , callback_data: '5', action : 'five' }],
            [{ text: 'Мотивация', callback_data: '6' }],
            [{ text: 'ММБ', callback_data: '7' }],
            // [{ text: 'Назад', callback_data: 'to_home' }]
        ]
    })
};

const branch = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Инфо по продукту', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'Обход ошибок', callback_data: 'info_err', action : 'new' }],
            [{ text: 'Ошибки в досье', callback_data: 'info_errDos', action : 'new' }],
            [{ text: 'Проверка паспорта', callback_data: 'info_dul', action : 'new' }],
            [{ text: 'Штрафы СВК', , mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm2qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmm,mxzocallback_data: 'info_fines', action : 'new' }]











 
        ]/
    })
}

const errors = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'НЕ РЕЗИДЕНТ США', callback_data: 'info_prod', action : 'new' }],
        ]
    })
}
//const buttons = [errors, errors_docs, pass_aprove]
const errors_docs = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'ДК НЕВЕРНЫ ДАННЫЕ НОВЫЙ КЛИЕНТ', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'КК НЕ ВЕРНЫ ДАННые', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'КК2 ОШИБКИ В ДОКУМЕНТАХ', callback_data: 'info_prod', action : 'new' }],
        ]
    })
}

const pass_aprove = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'ДК НЕВЕРНЫ ДАННЫЕ НОВЫЙ КЛИЕНТ', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'КК НЕ ВЕРНЫ ДАННые', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'КК2 ОШИБКИ В ДОКУМЕНТАХ', callback_data: 'info_prod', action : 'new' }],
        ]
    })
}

const x = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'В начало', callback_data: 'to_back', action : 'one' }],
        ]
    })
}

/**
 *
 * @param KK1 : 1
 * @param KK2 : 2
 * @param DK : 3
 * @param KL : 4
 * @param MotUI : 5
 *
 * */

client.onText(/\/start/, function (msg, match) {
    console.log(msg.chat.id)
    client.sendMessage(msg.chat.id, 'Check this'  , options)
        .then(r => client.sendMessage(msg.chat.id , r));
});

client.on('callback_query', async function (msg) {
    let answer = await msg.data;
    if (answer) {
        function otkat(){
            return 1;
        }
        otkat()
        console.log(answer)
        if (answer === "to_back" ){
            client.sendMessage(msg.from.id, 'Выберите продукт:', options)
                .then(r => client.sendMessage(msg.from.id , r).finally(() => client.deleteMessage(msg.id)));
        }
        else {
            if (answer === "info_prod") {
                client.sendMessage(msg.from.id , 'Информация по продукту', options);
            }
            client.sendMessage(msg.from.id , '', options)
            // let a = answer - 1;
            // console.log(ls["prod_info"][a][0])
            // if (ls["prod_info"][a][0] === undefined || null || NaN)
            //     client.sendMessage(msg.from.id, "Ответ не найден", x)
            //         .then((r) => console.log(r))
            // else client.sendMessage(msg.from.id, ls["prod_info"][a][0], x)
            //     .then((r) => console.log(r))
        }
    }
})
function closeKeyboard(msg) {
    client.editMessageText(msg.message.text,
        {message_id:msg.message.message_id , chat_id:msg.from.id,
            reply_markup: {
                remove_keyboard: true
            }}).catch((err) => {
        //some error handling
    })
}
client.on("message", async function (msg) {
    console.log(msg.text)
    if (msg.text === "КК 60 дней без %")
        await client.sendMessage(msg.chat.id, ls["prod_info"][0][0])
            .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
            .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "Дебетовая карта")
        await client.sendMessage(msg.chat.id, ls["prod_info"][1][0])
            .then((r) => console.log(r))
            .then(client.sendDocument(msg.chat.id, './docs/dk.pdf'))
            .finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "Автокредит")
        await client.sendMessage(msg.chat.id, ls["prod_info"][2][0])
            .then(client.sendDocument(msg.chat.id, './docs/cl.pdf'))
            .then((r) => console.log(r))
            .finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "Ипотека")
        client.sendMessage(msg.chat.id, ls["prod_info"][3][0])
            .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "Кредитный лимит")
        await client.sendMessage(msg.chat.id, ls["prod_info"][4][0])
            .then(client.sendDocument(msg.chat.id, './docs/kl.pdf'))
            .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "Мотивация")
        client.sendMessage(msg.chat.id, ls["prod_info"][5][0])
            .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "ММБ")
        client.sendMessage(msg.chat.id, ls["prod_info"][6][0])
            .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
    else if (msg.text === "Назад")
        client.sendMessage(msg.chat.id, 'Меню , ёпта', branch)
            .then(r => console.log(r))
});
// client.onText("КК 60 дней без %", async function(msg) {  
//     client.sendMessage(msg.from.id, ls["prod_info"][0][0])
//         .then((r) => console.log(r));
// });
// client.onText("КК 60 дней без %", async function(msg) {
//     client.sendMessage(msg.from.id, ls["prod_info"][0][0])
//         .then((r) => console.log(r));
// });
// client.onText("КК 60 дней без %", async function(msg) {
//     client.sendMessage(msg.from.id, ls["prod_info"][0][0])
//         .then((r) => console.log(r));
// });