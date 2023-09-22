const TelegramBot = require('node-telegram-bot-api'),
    config = require("./config.json"),
    ls = require("./local_app_storage.json"),
    fs = require("fs"),
    handler = require("./lib/handlers"),
    prefix = config.prefix,
    key = config.key.prod_info.full,
    storage = require("./lib/local_storage/filesystem"),
    DataHandler = require("./lib/datahander");

global.XMLHttpRequest = require('xhr2');
const {callbackPromise} = require("nodemailer/lib/shared");

const client = new TelegramBot(key, {
    polling: true,
});

getUsersData();
getMenuKeyboard();
DataHandler.createDataList()

let menuKeyboard = () => setTimeout(() => getMenuKeyboard(), 1000)

setInterval(() => {
    getUsersData()
}, 30000)

setInterval(() => getUsersData(), 30000)

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
    let data = fs.readFileSync(`${__dirname}/udata.json`);
    console.log(data)
    let a = msg.from.username
    for (const el of JSON.parse(data)) {
        if (el === a) {
            client.sendMessage(msg.chat.id , 'Dvi' , getMenuKeyboard())
            console.log()
        }
        else console.log("denied")
    }
});
/**
 * @param uri: https://docs.google.com/spreadsheets/d/1nWtLE1BFxchRV0edH3xJ0U1UxL67NKFP9U11wH1h2F0/edit#gid=0
 * */
function getMenuKeyboard(){
    let sName = 'MainMenuButtons'
    let sID = '1nWtLE1BFxchRV0edH3xJ0U1UxL67NKFP9U11wH1h2F0';
    let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
    let qRaw = 'Select A';
    let qRea = encodeURIComponent(qRaw);
    let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
    let dataFinal = []
    fetch(qUri)
        .then(r => r.text())
        .then(rd => {
            let data = JSON.parse(rd.substr(47).slice(0, -2))
            for (let i = 0; i < data.table.rows.length; i++){
                dataFinal.push(data.table.rows[i].c[0].v);
                console.log(data.table.rows[i].c[0].v)
            }
            console.log(dataFinal)
            fs.writeFileSync(`${__dirname}/storage/keyboard_main_data.json`, JSON.stringify(dataFinal));
        })
    console.log("dataUpdated");
    function createKeyboard() {
        let data_ofKeyBoard = JSON.parse(fs.readFileSync(`${__dirname}/storage/keyboard_main_data.json`).toString())
        let readyKeyboard = [];
        data_ofKeyBoard.forEach(element => {
            readyKeyboard.push(element)
        })
        console.log(readyKeyboard)
        const readyKeyboardTelegraph = {
            parse_mode: "Markdown",
            resize_keyboard: true,
            reply_markup: {
                keyboard: readyKeyboard.map(val => [{
                    text: val
                }])
            }
        }
        console.log(readyKeyboardTelegraph["reply_markup"]["keyboard"][0])
        return readyKeyboardTelegraph;
    }
    return createKeyboard();
}

function getUsersData() {
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

function _getUsersData () {
    return JSON.parse(fs.readFileSync(`${__dirname}/udata.json`).toString())
}

client.on('message', async function (msg) {
    _getUsersData().forEach(u => {
        if (msg.from.username === u){
            console.log(true)
            let res = DataHandler.queryCompare(msg.text)
            res = JSON.stringify(res)
            console.log(JSON.stringify(res) + ' ' + safeJsonParse(res))
            if (isJson(res) === true)
                client.sendMessage(msg.chat.id, msg.text , res)
                    .then(console.log(isJson(res)))
            else
                client.sendMessage(msg.chat.id, res)
                    .then(console.log(isJson(res)))
        }
    })
})

function isJson(str) {

}

function safeJsonParse(str) {
    try {
        return [null, JSON.parse(str)];
    } catch (err) {
        return [err];
    }
}
// client.on("message", async function (msg) {
//     let data = fs.readFileSync(`${__dirname}/udata.json`);
//     console.log(data)
//     let a = msg.from.username
//     for (const el of JSON.parse(data)) {
//         if (el === a) {
//             console.log("approved")
//             let i = 0;
//             getProductData_debet().forEach(element => {
//                 Object.keys(element[0]).forEach(jKey => {
//                     console.log(msg.text.trim() + " == " + jKey.trim())
//                     console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
//                     if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
//                         client.sendMessage(msg.chat.id , element[0][jKey].toString())
//                             .then(() => client.deleteMessage(msg.from.id, msg.message_id))
//                 })
//                 i++;
//             })
//             getProductData_credit().forEach(element => {
//                 Object.keys(element[0]).forEach(jKey => {
//                     console.log(msg.text.trim() + " == " + jKey.trim())
//                     console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
//                     if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
//                         client.sendMessage(msg.chat.id , element[0][jKey].toString())
//                             .then(() => client.deleteMessage(msg.from.id, msg.message_id))
//                 })
//                 i++;
//             })
//
//             getProductData_etc().forEach(element => {
//                 Object.keys(element[0]).forEach(jKey => {
//                     console.log(msg.text.trim() + " == " + jKey.trim())
//                     console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
//                     if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
//                         client.sendMessage(msg.chat.id , element[0][jKey].toString())
//                             .then(() => client.deleteMessage(msg.from.id, msg.message_id))
//                 })
//                 i++;
//             })
//
//             getProductData_nine().forEach(element => {
//                 Object.keys(element[0]).forEach(jKey => {
//                     console.log(msg.text.trim() + " == " + jKey.trim())
//                     console.log(msg.text.trim().length + "_===_" + jKey.trim().length)
//                     if (jKey.replace(/^a-zA-Z0-9 ]/g, '').trim() === msg.text.replace(/^a-zA-Z0-9 ]/g, '').trim())
//                         client.sendMessage(msg.chat.id , element[0][jKey].toString())
//                             .then(() => client.deleteMessage(msg.from.id, msg.message_id))
//                 })
//                 i++;
//             })
// //\u3164
//             if (msg.text === "Продукты банкa")
//                 await client.sendMessage(msg.chat.id,'Продукты банка', options)
//                     // .then(client.sendDocument(msg.chat.id, './docs/kk.pdf'))
//                     .then((r) => console.log(r)).finally(() => client.deleteMessage(msg.chat.id, msg.message_id));
//             else if (msg.text === "Дебетовые карты")
//                 await client.sendMessage(msg.chat.id, 'Дебетовые карты: ' ,await debet_keyboard)
//                     .then(() => client.deleteMessage(msg.from.id, msg.message_id)
//                     .then((r) => console.log(r)))
//             else if (msg.text === "Кредитные карты")
//                 await client.sendMessage(msg.chat.id, 'Кредитные карты: ' ,await credit_keyboard)
//                     .then(() => client.deleteMessage(msg.from.id, msg.message_id)
//                     .then((r) => console.log(r)))
//             else if (msg.text === "Остальное")
//                 await client.sendMessage(msg.chat.id, 'Остальное: ' ,await etc_keyboard)
//                         .then(() => client.deleteMessage(msg.from.id, msg.message_id)
//                             .then((r) => console.log(r))
//                                 .then(() => console.log("message_deleted")))
//             else if (msg.text === "Код 911")
//                 await client.sendMessage(msg.chat.id, 'остальное' ,await nine_keyboard)
//                     .then(() => client.deleteMessage(msg.from.id, msg.message_id)
//                     .then((r) => console.log(r)))
//             else if (msg.text === "Назад")
//                 await client.sendMessage(msg.chat.id, 'Назад', options)
//                     .then(() => client.deleteMessage(msg.from.id, msg.message_id)
//                     .then((r) => console.log(r)))
//         }else{
//             console.log("denied")
//         }
//     }
// });

// function getProductData_debet(){
//     function getProductData_debetCardsContent () {
//         let sName = 'debetCards'
//         let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
//         let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
//         let qRaw = 'Select *';
//         let qRea = encodeURIComponent(qRaw);
//         let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
//         let dataFinal = []
//         let xhr = new XMLHttpRequest();
//         xhr.open('get', qUri, true);
//         xhr.send()
//         xhr.onload = () => {
//             let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
//             for (let i = 1; i < data.table.rows.length; i++){
//                 dataFinal.push(
//                     `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
//                 );
//             }
//             // console.log(data.table.rows[1].c[0].v)
//             // console.log(dataFinal)
//             fs.writeFileSync(`${__dirname}/pdata.json`, JSON.stringify(dataFinal));
//         }
//     }
//     getProductData_debetCardsContent();
//     function dataParser() {
//         let data = fs.readFileSync(`${__dirname}/pdata.json`);
//         let finalData = [];
//         let finalData2 = [];
//         JSON.parse(data).forEach(element => {
//             // console.log(element)
//             // console.log("===================================================")
//             // console.log(element.split("||||"))
//             finalData.push(element.split("||||"))
//         });
//         finalData.forEach(element => {
//             let elName = element[0]
//             let elemready = {
//                 [elName]: `${element[1].trim()}`
//             }
//             finalData2.push([elemready])
//         })
//         return finalData2;
//     }
//     return dataParser();
// }
//
// function getProductData_credit(){
//     function getProductData_creditCardsContent () {
//         let sName = 'creditCards'
//         let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
//         let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
//         let qRaw = 'Select *';
//         let qRea = encodeURIComponent(qRaw);
//         let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
//         let dataFinal = []
//         let xhr = new XMLHttpRequest();
//         xhr.open('get', qUri);
//         xhr.send()
//         xhr.onload = () => {
//             let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
//
//             for (let i = 1; i < data.table.rows.length; i++){
//                 dataFinal.push(
//                     `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
//                 );
//             }
//
//             fs.writeFileSync(`${__dirname}/p_credit_data.json`, JSON.stringify(dataFinal), {
//                 recursive: true
//             });
//         }
//     }
//
//     getProductData_creditCardsContent();
//
//     function dataParser() {
//         let data = fs.readFileSync(`${__dirname}/p_credit_data.json`);
//         let finalData = [];
//         let finalData2 = [];
//         JSON.parse(data).forEach(element => {
//             finalData.push(element.split("||||"))
//         });
//         finalData.forEach(element => {
//             let elName = element[0]
//             let elemready = {
//                 [elName]: `${element[1].trim()}`
//             }
//             finalData2.push([elemready])
//         })
//         return finalData2;
//     }
//     return dataParser();
// }
//
// function getProductData_nine(){
//     function getProductData_nineContent () {
//         let sName = 'nineCode';
//         let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
//         let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
//         let qRaw = 'Select *';
//         let qRea = encodeURIComponent(qRaw);
//         let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
//         let dataFinal = []
//         let xhr = new XMLHttpRequest();
//         xhr.open('get', qUri, true);
//         xhr.send()
//         xhr.onload = () => {
//             let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
//             for (let i = 1; i < data.table.rows.length; i++){
//                 dataFinal.push(
//                     `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
//                 );
//             }
//
//             fs.writeFileSync(`${__dirname}/p_nine_data.json`, JSON.stringify(dataFinal));
//         }
//     }
//     getProductData_nineContent();
//
//     function dataParser() {
//         let data = fs.readFileSync(`${__dirname}/p_nine_data.json`);
//         let finalData = [];
//         let finalData2 = [];
//         JSON.parse(data).forEach(element => {
//             finalData.push(element.split("||||"))
//         });
//         finalData.forEach(element => {
//             let elName = element[0]
//             let elemready = {
//                 [elName]: `${element[1].trim()}`
//             }
//             finalData2.push([elemready])
//         })
//         return finalData2;
//     }
//     return dataParser();
// }
//
// function getProductData_etc(){
//     function getProductData_etcContent () {
//         let sName = 'etcInfo';
//         let sID = '1NVAMwDq462DhcDfVKDKcYuhH63U7jDCaY6jrAg8TAi8';
//         let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
//         let qRaw = 'Select *';
//         let qRea = encodeURIComponent(qRaw);
//         let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
//         let dataFinal = []
//         let xhr = new XMLHttpRequest();
//         xhr.open('get', qUri, true);
//         xhr.send()
//         xhr.onload = () => {
//             let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
//             for (let i = 1; i < data.table.rows.length; i++){
//                 dataFinal.push(
//                     `${data.table.rows[i].c[0].v} |||| ${data.table.rows[i].c[1].v}`
//                 );
//             }
//
//             fs.writeFileSync(`${__dirname}/p_etc_data.json`, JSON.stringify(dataFinal));
//         }
//     }
//     getProductData_etcContent();
//
//     function dataParser() {
//         let data = fs.readFileSync(`${__dirname}/p_etc_data.json`);
//         let finalData = [];
//         let finalData2 = [];
//         JSON.parse(data).forEach(element => {
//             finalData.push(element.split("||||"))
//         });
//         finalData.forEach(element => {
//             let elName = element[0]
//             let elemready = {
//                 [elName]: `${element[1].trim()}`
//             }
//             finalData2.push([elemready])
//         })
//         return finalData2;
//     }
//     return dataParser();
// }

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


