/** @namespace: DataHandlerModule
 *  @version 2.0.0.0
 *  @desc module to manipulate data, API Google Sheets, using FS module
**/
(function (){
    "use strict"
    //6616653341:AAH3vtr4nyezk96xJ8iZIIeVJprgeVT6Y8A // new bot key
    const fs = require("fs"),
    {
        NetworkDataId ,
        PathData
    } = require("./config");
    global.XMLHttpRequest = require('xhr2');

    module.exports = this.DataHandler = new class {
        getRenderLog = function (uname, uid, msg_id, msg_date) {
            console.trace(`getRenderLog() called by: <${uname}> with id: <${uid}>; message id: <${msg_id}> at date: ${msg_date}`)
            return `${PathData.path_to_local}localResponseData_type_list.json`
        }

        responseRenderer = async function (msg, callback) {
            if (msg === '/start' || msg === 'Назад')
                await callback(getMainMenuKeyboard(async function (d) {
                await callback(await d)
            }));
            else
                await callback(getResponseData(msg, async function (a) {
                await callback(await a)
            }));
        }

        refreshData = async function (){
            getRenderListFromNetwork();
        }

        callFileFromRenderer = async function (msg, callback) {
            await getResponseFile(msg, function (a) {
                callback(a);
            })
        }
        callMediaFromRenderer = async function (msg, callback) {
            await getResponseMedia(msg, function (a) {
                callback(a);
            })
        }
    }

    function getMainMenuKeyboard(callback) {
        getRenderListFromNetwork();
        let sName = `MainMenuList`;
        let sID = NetworkDataId.table_data;
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select *';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let keyboard_data = []
        let xhr = new XMLHttpRequest();
        xhr.open('get', qUri, true);
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push([{
                     [data.table.rows[i].c[0].v] : data.table.rows[i].c[1].v
                }]);
                keyboard_data.push(
                    data.table.rows[i].c[0].v
                )
            }
            let keyboard_r = {
                parse_mode: "Markdown",
                resize_keyboard: true,
                reply_markup: {
                    keyboard: keyboard_data.map(v => [{
                        text: v
                    }])
                }
            }
            callback(keyboard_r);
        }
    }

    function getRenderListFromNetwork() {
        let sName = `renderList`;
        let sID = NetworkDataId.table_data;
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
            for (let i = 0; i < data.table.rows.length; i++){
                dataFinal.push(data.table.rows[i].c[0].v)
            }
            createList2(dataFinal, async function (d) {
                setTimeout(async () => storeData(await d, 'localResponseData_type_list', 'response', function (err) {
                    console.log(err)
                }), 1000)
            })
        }
    }

    async function createList2(data, callback) {
        let data_fcol = []
        let data_fcol2 = []
        let data_fcol3 = []
        let data_fcol4 = []
        let list_data_comp = []
        data.forEach(e => {
            callData(e, function (d) {
                list_data_comp.push(d)
            })
        })

        function callData(el, callback) {
            let sName = el;
            let sID = NetworkDataId.table_data;
            let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
            let qRaw = 'Select *';
            let qRea = encodeURIComponent(qRaw);
            let qUri = `${base}&sheet=${sName}&tq=${qRea}`.toString();
            console.log(qRaw)
            let dataFinal = []
            let xhr = new XMLHttpRequest();
            xhr.open('get',qUri , true);
            xhr.send()
            xhr.onload = async () => {
                await xhr;
                console.log(qUri)
                let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
                console.log(data)
                for (let i = 0; i < data.table.rows.length; i++) {

                    if (data.table.rows[i].c[0].v !== 'title') {
                        data_fcol.push(data.table.rows[i].c[0].v)
                        try {
                            data_fcol2.push(data.table.rows[i].c[1].v)
                            if (data.table.rows[i].c[2].v !== 'true' || data.table.rows[i].c[2].v !== 'false' || data.table.rows[i].c[2].v !== 'null')
                                data_fcol3.push(data.table.rows[i].c[2].v)
                        } catch (e) {
                            //console.trace(qUri)
                        }
                        try{
                            if (data.table.rows[i].c[3].v !== 'true' || data.table.rows[i].c[3].v !== 'false' || data.table.rows[i].c[3].v !== 'null')
                                data_fcol4.push(data.table.rows[i].c[3].v)
                        }
                        catch (e) {
                            console.log(e)
                        }
                    }
                }
                let finalListData = [{
                    [el]: {
                        "title": data_fcol.map(v => v),
                        "content": data_fcol2.map(v => v),
                        "file": data_fcol3.map(v => v),
                        "media": data_fcol4.map(v => v)
                    }
                }]
                callback(finalListData)
                data_fcol = []
                data_fcol2 = []
                data_fcol3 = []
                data_fcol4 = []
            }
        }
        callback(list_data_comp)
    }

    function storeData(data, data_nameFile, data_nameJson, callback) {
        let data_fin = {
            [data_nameJson] : data
        }
        if (!fs.existsSync(PathData.path_to_local)) {
            fs.mkdir(PathData.path_to_local, {
                recursive: true
            },function (err, path) {
                if (err)
                    console.log(err)
                else
                    console.trace(`local_data dir created at: ${path}`)
            })
        }
        try{
            fs.writeFile(`${PathData.path_to_local}/${data_nameFile}.json`,
                JSON.stringify(data_fin),{

                },
                function (err) {
                    if (err)
                        console.log(err)
                })
        }
        catch (e) {
            callback(e)
        }
    }

    async function getResponseData(message, callback) {
        let data_nameFile = 'localResponseData_type_list';
        let raw_data = fs.readFileSync(`${PathData.path_to_local}/${data_nameFile}.json`)
        let parsed_data = JSON.parse(raw_data.toString());
        let i = 0;
        let r;
        await parsed_data["response"].forEach(obj => {
            obj[0][Object.keys(obj[0])[0]].title.forEach(el => {
                if (el === message) {
                    r = obj[0][Object.keys(obj[0])[0]].content[obj[0][Object.keys(obj[0])[0]].title.indexOf(el)]
                }
            });
            i++
        })
        await createKeyBoard(parsed_data["response"], r, async function (data) {
            callback(await data)
        })
    }

    async function createKeyBoard(data, r, callback) {
        let c;
        try {
            c = r.toString().replace('<', '').replace('>', '')
        } catch (e) {
            console.log(e)
        }
        let kb;
        let i = 0;
        let keyboard_ready;
        for (const obj of data) {
            if (Object.keys(obj[0]).toString().replace(/^a-zA-Z0-9 ]/g, '').trim()
                === c) {
                kb = obj[0][c]["title"]
                kb.push('Назад')
                keyboard_ready = {
                    parse_mode: "Markdown",
                    resize_keyboard: true,
                    reply_markup: {
                        keyboard: kb.map(val => [{
                            text: val.toString()
                        }])
                    }
                }
                break;
            }
            i++;
        }
        if (i === data.length){
            callback(await r)
        }else callback(keyboard_ready) //await
    }

    async function getResponseFile(message, callback) {
        let data_nameFile = 'localResponseData_type_list';
        let raw_data = fs.readFileSync(`${PathData.path_to_local}/${data_nameFile}.json`)
        let parsed_data = JSON.parse(raw_data.toString());
        let i = 0;
        let r;
        await parsed_data["response"].forEach(obj => {
            obj[0][Object.keys(obj[0])[0]].title.forEach(el => {
                if (el === message) {
                    r = obj[0][Object.keys(obj[0])[0]].file[obj[0][Object.keys(obj[0])[0]].title.indexOf(el)] /**   */
                }
            });
            i++
        })
        console.trace(r)
        callback(`${PathData.path_to_files}${r}`);
    }

    async function getResponseMedia(message, callback) {
        let data_nameFile = 'localResponseData_type_list';
        let raw_data = fs.readFileSync(`${PathData.path_to_local}/${data_nameFile}.json`)
        let parsed_data = JSON.parse(raw_data.toString());
        let i = 0;
        let r;
        await parsed_data["response"].forEach(obj => {
            obj[0][Object.keys(obj[0])[0]].title.forEach(el => {
                if (el === message) {
                    r = obj[0][Object.keys(obj[0])[0]].media[obj[0][Object.keys(obj[0])[0]].title.indexOf(el)] /**   */
                }
            });
            i++
        })
        console.trace(r)
        callback(r.replace(/^a-zA-Z0-9 ]/g, '').trim());
    }
}.call(this))
// https://airsoft-rus.ru/catalog/1030/466965/

/*

*/