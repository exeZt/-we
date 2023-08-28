const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    ls = require("./local_app_storage.json"),
    fs = require("fs"),
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.prod_info.full,
    storage = require("./lib/local_storage/filesystem");

const {callbackPromise} = require("nodemailer/lib/shared");

const client = new TelegramBot(key, {
    polling: true,
});
getSheetsData()

setInterval(() => getSheetsData(), 30000)

client.on("message",  async (message) => {

});
const options = {
    parse_mode: "Markdown",
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'КК 60 дней без %', callback_data: '1', action : 'one' }],
            [{ text: 'Дебетовые карты', callback_data: '2', action : 'two' }],
            [{ text: 'Автокредит' , callback_data: '3', action : 'three' }],
            [{ text: 'Ипотека' , callback_data: '4', action : 'four' }],
            [{ text: 'Кредитный лимит' , callback_data: '5', action : 'five' }],
            [{ text: 'ММБ', callback_data: '7' }],
            [{ text: 'Назад', callback_data: 'to_home' }]
        ]
    })
};

const dk = {
    parse_mode: "Markdown",
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Дебетовая обычная' }],
            [{ text: 'Дебетовая AlfaTravel' }],
            [{ text: 'Дебетовая AlfaTravel Premium' }],
            [{ text: 'Дебетовая Alfa Premium' }],
            [{ text: 'Дебетовая детская' }],
            [{ text: 'Стикер AlfaKids (детский)' }],
            [{ text: 'Стикер Alfa' }],
            [{ text: 'Стикер AlfaTravel' }],
            [{ text: 'Назад' }]
        ]
    })
}
const kk = {

}

const branch = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Ручная выдачa', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'YП', callback_data: 'info_err', action : 'new' }],
            [{ text: 'Мотивaция', callback_data: '6' }],
            [{ text: 'Продукты банкa', callback_data: 'info_errDos', action : 'new' }],
            [{ text: 'Частые ошибки', callback_data: 'info_errDos', action : 'new' }],
            [{ text: '911 - основное', callback_data: 'info_errDos', action : 'new' }],
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

        client.getMe()
            .then(function (info) {
                console.log(msg.from.username)
            })
    client.sendMessage(msg.chat.id, 'Выбирай'  , branch)
        .then(r => client.sendMessage(msg.chat.id , r))
        .then(() => client.deleteMessage(msg.chat.id, msg.from.id))
        .finally(
            () => client.deleteMessage(msg.chat.id, msg.message_id)
        );
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

function getSheetsData() {
    let sName = 'userList'
    let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
    let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
    let qRaw = 'Select C';
    let qRea = encodeURIComponent(qRaw);
    let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
    let dataFinal = []
    fetch(qUri)
        .then(r => r.text())
        .then(rd => { let data =
            JSON.parse(rd.substr(47).slice(0, -2))
            console.log(data.table.rows[0].c[0].v)
            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push(data.table.rows[i].c[0].v);
                console.log(data.table.rows[i].c[0].v)
            }
            console.log(dataFinal)
            fs.writeFileSync(`${__dirname}/udata.json`, JSON.stringify(dataFinal));
        })
    console.log("dataUpdated")
}


client.on("message", async function (msg) {
    let data = fs.readFileSync(`${__dirname}/udata.json`);
    console.log(data)
    let a = msg.from.username
    for (const el of JSON.parse(data)) {
        if (el === a) {
            console.log("approved")

            if (msg.text === "Ручная выдачa")
                await client.sendMessage(msg.chat.id, ls["processing"][0]["av"])
                    //.then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Продукты банкa")
                await client.sendMessage(msg.chat.id,'Продукты банка', options)
                    // .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "YП")
                await client.sendMessage(msg.chat.id, ls["processing"][0]["up"])
                    .then(() => client.sendMessage(msg.chat.id, ls["processing"][0]["updvd"]))
                    .then(() => client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));

            else if (msg.text === "Частые ошибки")
                await client.sendMessage(msg.chat.id,ls["errors"][0]["all"])
                    // .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "911 - основное")
                await client.sendMessage(msg.chat.id,ls["911"][0]["all"])
                    // .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));

            // 904894186

            if (msg.text === "КК 60 дней без %")
                await client.sendMessage(msg.chat.id, ls["prod_info"][0][0])
                    .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Дебетовые карты")
                await client.sendMessage(msg.chat.id, 'дебет' ,dk)
                    .then((r) => console.log(r))
                    .finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            //.finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
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
            else if (msg.text === "Мотивaция")
                client.sendMessage(msg.chat.id, ls["prod_info"][5][0])
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "ММБ")
                client.sendMessage(msg.chat.id, ls["prod_info"][6][0])
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));

            else if (msg.text === "Назад")
                client.sendMessage(msg.chat.id, 'Выбирай', branch)
                    .then(r => console.log(r))
                    .finally(() => client.deleteMessage(msg.chat.id, msg.message_id))

            // DEBETOVKI

            else if (msg.text === "Дебетовая обычная")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][0])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfa_default.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Дебетовая AlfaTravel")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][1])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_default.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Дебетовая AlfaTravel Premium")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][2])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_premium.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Дебетовая Alfa Premium")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][3])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_premium.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Дебетовая детская")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][4])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_premium.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Стикер AlfaKids (детский)")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][5])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_premium.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Стикер Alfa")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][6])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_premium.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Стикер AlfaTravel")
                await client.sendMessage(msg.chat.id, ls["product_data"][0]["dk"][7])
                    .then(client.sendDocument(msg.chat.id, './docs/dk/dk_alfatravel_premium.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            break;
        }else{
            console.log("denied")
        }
    }
    console.log(msg.text)
});