const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    ls = require("./local_app_storage.json"),
    fs = require("fs"),
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.prod_info.full,
    storage = require("./lib/local_storage/filesystem");

global.XMLHttpRequest = require('xhr2');
const {callbackPromise} = require("nodemailer/lib/shared");

const client = new TelegramBot(key, {
    polling: true,
});

getSheetsData()
getProductData_debet();
getProductData_credit();
getProductData_etc();
getProductData_nine();

let debet_keyboard = createKeyboard('dk');
let credit_keyboard = createKeyboard('kk');
let etc_keyboard = createKeyboard('etc');
let nine_keyboard = createKeyboard('nine');

setInterval(() => {
    getSheetsData()
    getProductData_debet();
    getProductData_credit();
    getProductData_etc();
    getProductData_nine();

    debet_keyboard = createKeyboard('dk');
    credit_keyboard = createKeyboard('kk');
    etc_keyboard = createKeyboard('etc');
    nine_keyboard = createKeyboard('nine');
}, 30000)

setInterval(() => getSheetsData(), 30000)

const options = {
    parse_mode: "Markdown",
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Кредитные карты', callback_data: '1', action : 'one' }],
            [{ text: 'Дебетовые карты', callback_data: '2', action : 'two' }],
            [{ text: 'Код 911' , callback_data: '3', action : 'three' }],
            [{ text: 'Остальное' , callback_data: '3', action : 'three' }],
        ]
    })
};

const kk = {
    parse_mode: "Markdown",
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Кредитная карта с целым годом без %' }],
            [{ text: 'Кредитная карта Alfa Travel' }],
            [{ text: 'Кредитная карта билайн 365 дней без %' }],
            [{ text: 'Кредитная карта 60 без % на всё' }],
            [{ text: 'Кредитные Х5 Карты Пятёрочка и Перекрёсток' }],
            [{ text: 'Назад' }]
        ]
    })
}

const branch = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Продукты банкa', callback_data: 'info_errDos', action : 'new' }],
            [{ text: 'Ручная выдачa', callback_data: 'info_prod', action : 'new' }],
            [{ text: 'YП', callback_data: 'info_err', action : 'new' }],
            [{ text: 'Частые ошибки', callback_data: 'info_errDos', action : 'new' }],
            [{ text: '911 - основное', callback_data: 'info_errDos', action : 'new' }],
            [{ text: 'Мотивaция', callback_data: '6' }],
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
    client.sendMessage(msg.chat.id, 'Выбирай'  , options)
        .then(r => client.sendMessage(msg.chat.id , r))
        .then(() => client.deleteMessage(msg.chat.id, msg.from.id))
        .finally(
            () => client.deleteMessage(msg.chat.id, msg.message_id)
        );
});

async function createKeyboard(type) {
    let
        array_dk = [],
        array_kk = [],
        array_etc = [],
        array_nine = [],
        readyButtonsList_dk = [],
        readyButtonsList_kk = [],
        readyButtonsList_etc = [],
        readyButtonsList_nine = [];

    let buttonBack = 'Назад';

    getProductData_debet().forEach(element => {
        Object.keys(element[0]).forEach(jKey => {
            array_dk.push(jKey)
            console.log(jKey)
        })
    })
    array_dk.forEach(element => {
        readyButtonsList_dk.push(`${element.trim()}`)
    })
    readyButtonsList_dk.push(`${buttonBack}`)

    getProductData_credit().forEach(element => {
        Object.keys(element[0]).forEach(jKey => {
            array_kk.push(jKey)
            console.log(jKey)
        })
    })
    array_kk.forEach(element => {
        readyButtonsList_kk.push(`${element.trim()}`)
    })
    readyButtonsList_kk.push(`${buttonBack}`);

    getProductData_etc().forEach(element => {
        Object.keys(element[0]).forEach(jKey => {
            array_etc.push(jKey)
            console.log(jKey)
        })
    })
    array_etc.forEach(element => {
        readyButtonsList_etc.push(`${element.trim()}`)
    })
    readyButtonsList_etc.push(`${buttonBack}`);

    getProductData_nine().forEach(element => {
        Object.keys(element[0]).forEach(jKey => {
            array_nine.push(jKey)
            console.log(jKey)
        })
    })
    array_nine.forEach(element => {
        readyButtonsList_nine.push(`${element.trim()}`)
    })
    readyButtonsList_nine.push(`${buttonBack}`);


    console.log(readyButtonsList_dk)
    const dkKeyboard = {
        parse_mode: "Markdown",
        resize_keyboard: true,
        reply_markup: {
            keyboard: readyButtonsList_dk.map(val => [{
                text: val
            }])
        }
    }
    const kkKeyboard = {
        parse_mode: "Markdown",
        resize_keyboard: true,
        reply_markup: {
            keyboard: readyButtonsList_kk.map(val => [{
                text: val
            }])
        }
    }

    const etcKeyboard = {
        parse_mode: "Markdown",
        resize_keyboard: true,
        reply_markup: {
            keyboard: readyButtonsList_etc.map(val => [{
                text: val
            }])
        }
    }

    const nineKeyboard = {
        parse_mode: "Markdown",
        resize_keyboard: true,
        reply_markup: {
            keyboard: readyButtonsList_nine.map(val => [{
                text: val
            }])
        }
    }

    if (type === 'kk')
        return kkKeyboard
    else if (type === 'dk')
        return dkKeyboard
    else if (type === 'etc')
        return etcKeyboard
    else if (type === 'nine')
        return nineKeyboard
}

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
    console.log("dataUpdated");
}

client.on("message", async function (msg) {
    let data = fs.readFileSync(`${__dirname}/udata.json`);
    console.log(data)
    let a = msg.from.username
    for (const el of JSON.parse(data)) {
        if (el === a) {
            console.log("approved")
            let i = 0;
            getProductData_debet().forEach(element => {
                Object.keys(element[0]).forEach(jKey => {
                    console.log(msg.text.trim() + " == " + jKey.trim())
                    console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
                    if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
                        client.sendMessage(msg.chat.id , element[0][jKey].toString())
                            .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                })
                i++;
            })
            getProductData_credit().forEach(element => {
                Object.keys(element[0]).forEach(jKey => {
                    console.log(msg.text.trim() + " == " + jKey.trim())
                    console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
                    if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
                        client.sendMessage(msg.chat.id , element[0][jKey].toString())
                            .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                })
                i++;
            })

            getProductData_etc().forEach(element => {
                Object.keys(element[0]).forEach(jKey => {
                    console.log(msg.text.trim() + " == " + jKey.trim())
                    console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
                    if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
                        client.sendMessage(msg.chat.id , element[0][jKey].toString())
                            .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                })
                i++;
            })

            getProductData_nine().forEach(element => {
                Object.keys(element[0]).forEach(jKey => {
                    console.log(msg.text.trim() + " == " + jKey.trim())
                    console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
                    if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
                        client.sendMessage(msg.chat.id , element[0][jKey].toString())
                            .then(() => client.deleteMessage(msg.from.id, msg.message_id))
                })
                i++;
            })
//\u3164
            if (msg.text === "Продукты банкa")
                await client.sendMessage(msg.chat.id,'Продукты банка', options)
                    // .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
                    .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
            else if (msg.text === "Дебетовые карты")
                await client.sendMessage(msg.chat.id, 'Дебетовые карты: ' ,await debet_keyboard)
                    .then(() => client.deleteMessage(msg.from.id, msg.message_id)
                    .then((r) => console.log(r)))
            else if (msg.text === "Кредитные карты")
                await client.sendMessage(msg.chat.id, 'Кредитные карты: ' ,await credit_keyboard)
                    .then(() => client.deleteMessage(msg.from.id, msg.message_id)
                    .then((r) => console.log(r)))
            else if (msg.text === "Остальное")
                await client.sendMessage(msg.chat.id, 'Остальное: ' ,await etc_keyboard)
                        .then(() => client.deleteMessage(msg.from.id, msg.message_id)
                            .then((r) => console.log(r))
                                .then(() => console.log("message_deleted")))
            else if (msg.text === "Код 911")
                await client.sendMessage(msg.chat.id, 'остальное' ,await nine_keyboard)
                    .then(() => client.deleteMessage(msg.from.id, msg.message_id)
                    .then((r) => console.log(r)))
            else if (msg.text === "Назад")
                await client.sendMessage(msg.chat.id, 'Назад', options)
                    .then(() => client.deleteMessage(msg.from.id, msg.message_id)
                    .then((r) => console.log(r)))
        }else{
            console.log("denied")
        }
    }
});

function getProductData_debet(){
    function getProductData_debetCardsContent () {
        let sName = 'debetCards'
        let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select *';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let xhr = new XMLHttpRequest();
        xhr.open('get', qUri, true);
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push(
                    `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
                );
            }
            // console.log(data.table.rows[1].c[0].v)
            // console.log(dataFinal)
            fs.writeFileSync(`${__dirname}/pdata.json`, JSON.stringify(dataFinal));
        }
    }
    getProductData_debetCardsContent();
    function dataParser() {
        let data = fs.readFileSync(`${__dirname}/pdata.json`);
        let finalData = [];
        let finalData2 = [];
        JSON.parse(data).forEach(element => {
            // console.log(element)
            // console.log("===================================================")
            // console.log(element.split("||||"))
            finalData.push(element.split("||||"))
        });
        finalData.forEach(element => {
            let elName = element[0]
            let elemready = {
                [elName]: `${element[1].trim()}`
            }
            finalData2.push([elemready])
        })
        return finalData2;
    }
    return dataParser();
}

function getProductData_credit(){
    function getProductData_creditCardsContent () {
        let sName = 'creditCards'
        let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select *';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let xhr = new XMLHttpRequest();
        xhr.open('get', qUri);
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))

            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push(
                    `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
                );
            }

            fs.writeFileSync(`${__dirname}/p_credit_data.json`, JSON.stringify(dataFinal), {
                recursive: true
            });
        }
    }

    getProductData_creditCardsContent();

    function dataParser() {
        let data = fs.readFileSync(`${__dirname}/p_credit_data.json`);
        let finalData = [];
        let finalData2 = [];
        JSON.parse(data).forEach(element => {
            finalData.push(element.split("||||"))
        });
        finalData.forEach(element => {
            let elName = element[0]
            let elemready = {
                [elName]: `${element[1].trim()}`
            }
            finalData2.push([elemready])
        })
        return finalData2;
    }
    return dataParser();
}

function getProductData_nine(){
    function getProductData_nineContent () {
        let sName = 'nineCode';
        let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select *';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let xhr = new XMLHttpRequest();
        xhr.open('get', qUri, true);
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push(
                    `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
                );
            }

            fs.writeFileSync(`${__dirname}/p_nine_data.json`, JSON.stringify(dataFinal));
        }
    }
    getProductData_nineContent();

    function dataParser() {
        let data = fs.readFileSync(`${__dirname}/p_nine_data.json`);
        let finalData = [];
        let finalData2 = [];
        JSON.parse(data).forEach(element => {
            finalData.push(element.split("||||"))
        });
        finalData.forEach(element => {
            let elName = element[0]
            let elemready = {
                [elName]: `${element[1].trim()}`
            }
            finalData2.push([elemready])
        })
        return finalData2;
    }
    return dataParser();
}

function getProductData_etc(){
    function getProductData_etcContent () {
        let sName = 'etcInfo';
        let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select *';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let xhr = new XMLHttpRequest();
        xhr.open('get', qUri, true);
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push(
                    `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
                );
            }

            fs.writeFileSync(`${__dirname}/p_etc_data.json`, JSON.stringify(dataFinal));
        }
    }
    getProductData_etcContent();

    function dataParser() {
        let data = fs.readFileSync(`${__dirname}/p_etc_data.json`);
        let finalData = [];
        let finalData2 = [];
        JSON.parse(data).forEach(element => {
            finalData.push(element.split("||||"))
        });
        finalData.forEach(element => {
            let elName = element[0]
            let elemready = {
                [elName]: `${element[1].trim()}`
            }
            finalData2.push([elemready])
        })
        return finalData2;
    }
    return dataParser();
}

/***
 * Отчет
 * Добавлены кк х5 и билайн
 * Добавлены 911 и Остальное: {
 *     УП, Ручная выдача
 * }
 * Добавлено удаление сообщений
 * после нажатия кнопок
 * Изменения клавиатуры {
 *     добавлено под 911 & остальное
 *     исправлена главная
 * }
 * Добавлено автообновление материала (30 сек)
 * исправлены баги
 *
 */

// Краткая инфа:
// добавил 911 и "остальное"
// каждые 30 секунд меняется клава и инфа(не проверено)
// листы:
//     etcInfo : Остальное (пока только УП и Ручная)
//     debetCards: Дебетовые карты
//     creditCards: Кредитные карты
//     nineCode: код 911
//     userList: лист пользователей(вайт лист)
// обновление бота(для глобальных изменений):
//     1. очистить историю
//     2. /start
//     больше ничего не требуется
//
// ИНФО О ПРОДУКТАХ И НОВЫЕ КНОПКИ ДОБАВЛЕНЫЕ В ГУГЛ ЛИСТАХ
// ОБНОВЯТСЯ САМИ В ТЕЧЕНИИ 30СЕКУНД
//
// Все дальнейшие изменения нужно согласовать,
//     сможем сделать или нет.
//
// Планируется:
//     1. Удалять историю у убранных из вайтлиста пользователей
//     2. Дополнение инфы
//     3. Добавление презентаций к информации о продукте (динамически)
//     4. Ремот для бота(удаленное включение)


