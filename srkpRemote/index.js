const TelegramBot = require('node-telegram-bot-api'),
    fs = require("fs"),
    { exec } = require("child_process"),
    key = "6313711304:AAGsh3iEROp6g1thYCU7-C4KcUK06aky6AY"
    PowerShell = require("powershell"),
        {fork} = require('child_process'),
    client = new TelegramBot(key, { polling: true });

let processCh = require('process')
var ch =  require('process');
let switcher = true;
let child = fork('../productInfo/product_info.js');

child.on('message', (message) => {
    if (message === 'START')
        console.log("start")
    else if(message === 'CLOSE')
        child.kill(child.pid)
});




global.XMLHttpRequest = require('xhr2');
    let keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
                [{  text: 'Включить' , callback_data: 'info_errDos' , action: 'new' }],
                [{  text: 'Выключить', callback_data: 'info_errDos' , action: 'new' }],
                [{  text: 'Состояние', callback_data: 'info_errDos' , action: 'new' }],
            ]
        })
    }

client.onText(/\/start/, function (msg, match) {
    console.log(msg.from.username)
   if (msg.from.username !== 'piurg'){
       client.sendMessage(msg.chat.id, 'Этот дом запривачин, гнида блять')
   }
   else {
       client.sendMessage(msg.chat.id, '?bot'  , keyboard)
           .then(() => client.deleteMessage(msg.chat.id, msg.from.id))
   }
});

client.on("message", async function (msg) {
    if (msg.text === "Включить") {
        if (switcher === true)
            console.log('already started')
        else {
            turnOnBot(msg)
            switcher = true;
            client.sendMessage(msg.chat.id, 'Бот включен')
        }
    }
    else if (msg.text === "Выключить") {
        turnOffBot();
        switcher = false;
        client.sendMessage(msg.chat.id, 'Бот выключен')
    }
    else if (msg.text === "Состояние") {
        client.sendMessage(msg.chat.id, `включен: ${switcher}`)
    }
    else {

    }
});

function turnOnBot (msg, client){
    child = fork('../productInfo/product_info.js')
}



function turnOffBot(msg, client) {
    process.kill(child.pid)
}