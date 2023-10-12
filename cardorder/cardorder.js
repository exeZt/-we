const TelegramBot = require('node-telegram-bot-api'),
    fs = require("fs"),
    { Key, storagePath } = require("./lib/config"),
    client = new TelegramBot(Key, {
        polling: true,
    })

client.on('message', async function (msg) {
    console.log(msg.chat.id)
    let mess;
    try{
        isAdmin(msg.from.username, function (r) {
            if (r === true){

            }else {
                mess = msg.text.split('\n')
                console.log(mess)
                if (mess[0] === 'Заказ карт'){
                    sendOrderToFile(msg.text, function (r) {
                        if (r === true)
                            client.sendMessage(msg.chat.id , 'Заказ отправлен', {
                                reply_to_message_id : msg.from.message_id
                            })
                    })
                }
            }
        })
    }
    catch (e) {
        console.trace(e)
    }
})

function sendOrderToFile(data, callback) {
    createOrderDir(function (r) {
        if (r === true){
            try {
                console.log(`${storagePath}/${getDate()}.txt`)
                fs.appendFile(`${storagePath}/${getDate()}.txt`, `\n${data.replace('Заказ карт', '')}`, function () {
                    callback(true)
                })
            }
            catch (e) {
                if (e)
                    callback(false)
            }
        }
        else {
            console.log(`err to create DIR`)
        }
    })
}

function createOrderDir(callback) {
    if (fs.existsSync(storagePath)){
        callback(true)
    } else {
        try {
            fs.mkdir(storagePath, {
                recursive: true
            }, function (err) {
                if (err)
                    callback(false)
                else
                    callback(true)
            })
        }catch (e) {
            if (e)
                callback(false)
        }
    }
}

function isAdmin(username, callback) {
    let sName = 'adminsList'
    let sID = NetworkDataId.table_auth;
    let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
    let qRaw = 'Select *';
    let qRea = encodeURIComponent(qRaw);
    let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
    let dataFinal = []
    let xhr = new XMLHttpRequest();
    xhr.open('get', qUri, true)
    xhr.send()
    xhr.onload = () => {
        try{
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
            for (let i = 1; i < data.table.rows.length; i++){
                console.log(i)
                try {
                    dataFinal.push([{
                        username: data.table.rows[i].c[0].v,
                        uservks: data.table.rows[i].c[1].v,
                        usertg: data.table.rows[i].c[2].v
                    }])
                }
                catch (e) {
                    console.log(e)
                }
            }
            let bool;
            dataFinal.forEach(el => {
                if (el[0].usertg === username)
                    bool = true;
            });
            if (bool === true)
                callback(true)
            else
                callback(false)
        } catch (e) {
            console.trace(`error caught at: ${e}`)
        }
    }
}

function getDate() {
    let a = new Date();
    return `${a.getFullYear()}-${a.getMonth()}-${a.getDay()}`
}