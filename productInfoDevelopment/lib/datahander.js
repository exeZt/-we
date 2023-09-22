(function (){
    "use strict"

    const fs = require("fs");
    global.XMLHttpRequest = require('xhr2');
    const { callbackPromise } = require("nodemailer/lib/shared");

    module.exports = this.DataHandler = new class {
        createDataList = function () {
            let path_of_list = `${__dirname}/storage/dataList1.json`;
            if (!fs.existsSync(`${__dirname}/storage`)) {
                fs.mkdir(`${__dirname}/storage`, { recursive: true }, function (err) {
                    if (err) 
                        throw err
                })
                fs.writeFile(`${__dirname}/storage/dataList1.json`, '~', function (err) {
                     if (err)
                         throw err
                });
            }
            getRenderList()
        }
        queryCompare = function (query) {
            let responseVars = JSON.parse(fs.readFileSync(`${__dirname}/storage/renderComponent/renderFinal.json`).toString())["listsResponseData"];
            let tres;
            let queryK = query.replace(/^a-zA-Z0-9 ]/g, '').trim()
            // console.log(responseVars)
            console.log(queryK)
            responseVars.forEach(el => {
                console.log(`${Object.keys(el)[0]} || ${queryK}`)
                let a = Object.keys(el)[0];
                if (a === queryK){
                    console.log(true)
                    console.log(el[Object.keys(el)[0]])
                    if (el[Object.keys(el)[0]].startsWith('<') & el[Object.keys(el)[0]].endsWith('>'))
                    {
                        tres = getResponseList(el[Object.keys(el)[0]].replace('<', '').replace('>', ''));
                    }
                    else {
                        tres = el[Object.keys(el)[0]]
                    }
                }
            })
            console.log(tres)
            return tres;
        }
    }
    /**
    * @param func: Функции исп. для модуля
    * */

    function getRenderList() {
        let sName = 'renderList';
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
                for (let i = 1; i < data.table.rows.length; i++){
                    dataFinal.push(data.table.rows[i].c[0].v);
                    console.log(data.table.rows[i].c[0].v)
                }
                console.log(dataFinal)
                fs.writeFile(`${__dirname}/storage/renderComponent/render.json`, JSON.stringify(dataFinal), function (err) {
                    if (err)
                        console.log(err)
                });
            })
        let renderList = fs.readFileSync(`${__dirname}/storage/renderComponent/render.json`).toString()
        let renderFinalData = {
            "lists" : JSON.parse(renderList).map(list => [{ list_name : list }])
        };
        let renderCompList = [];

        renderFinalData["lists"][0].forEach(element => renderCompList.push(element))
        // console.log(renderCompList)/** READY */
        console.log(renderFinalData["lists"][0][0]["list_name"]) /** correct : renderFinalData["lists"][0][0]["list_name"] */
        let XZ = 0;
        let a = JSON.parse(renderList)
        a.forEach(el => {
            console.log(XZ++)
            let sID = '1nWtLE1BFxchRV0edH3xJ0U1UxL67NKFP9U11wH1h2F0';
            console.log(el)
            let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
            let qRaw = 'Select A';
            let qRea = encodeURIComponent(qRaw);
            let sName = el;
            let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
            let dataFinal = [];
            fetch(qUri)
                .then(r => {
                    console.log(`${r.status} :: ${qUri}`)
                    if (r.status !== 200)
                        return "err"
                    else
                        return r.text()
                })
                .then(rd => {
                    if (rd.toString() === 'err'){
                        console.log("error occured")
                    }
                    else {
                        console.log("EWOW")
                        let data;
                        try{
                            data = JSON.parse(rd.substr(47).slice(0, -2))
                        } catch (e) {
                            console.log(e);
                        }
                        for (let i = 1; i < data.table.rows.length; i++){
                            dataFinal.push(data.table.rows[i].c[0].v);
                            console.log(data.table.rows[i].c[0].v)
                        }
                        console.log(dataFinal)
                        fs.mkdir(`${__dirname}/storage/renderComponent/lists/`,
                            { recursive: true } ,function (err) {
                            if (err)
                                console.log(err)
                        })
                        fs.writeFile(`${__dirname}/storage/renderComponent/lists/${el}.json`, JSON.stringify(dataFinal), function (err) {
                            if (err)
                                console.log(err)
                        });
                    }
                })
        })
        /**
         * @param renderingResponse: Рендер ответных сообщений+ клава
         * */
        a.forEach(el => {
            console.log(XZ++)
            let sID = '1nWtLE1BFxchRV0edH3xJ0U1UxL67NKFP9U11wH1h2F0';
            console.log(el)
            let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
            let qRaw = 'Select B';
            let qRea = encodeURIComponent(qRaw);
            let sName = el;
            let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
            let dataFinal = [];
            fetch(qUri)
                .then(r => {
                    console.log(`${r.status} :: ${qUri}`)
                    if (r.status !== 200)
                        return "err"
                    else
                        return r.text()
                })
                .then(rd => {
                    if (rd.toString() === 'err'){
                        console.log("error occured")
                    }
                    else {
                        console.log("EWOW")
                        let data;
                        try{
                            data = JSON.parse(rd.substr(47).slice(0, -2))
                        } catch (e) {
                            console.log(e);
                        }
                        for (let i = 1; i < data.table.rows.length; i++){
                            dataFinal.push(data.table.rows[i].c[0].v);
                            console.log(data.table.rows[i].c[0].v)
                        }
                        console.log(dataFinal)
                        fs.mkdir(`${__dirname}/storage/renderComponent/lists/`,
                            { recursive: true } ,function (err) {
                                if (err)
                                    console.log(err)
                            })
                        fs.writeFile(`${__dirname}/storage/renderComponent/lists/${el}-prod.json`, JSON.stringify(dataFinal), function (err) {
                            if (err)
                                console.log(err)
                        });
                    }
                })
        })
        //t
        let renderList_ = fs.readFileSync(`${__dirname}/storage/renderComponent/render.json`).toString()
        let toRendFile = [];
        JSON.parse(renderList_).forEach(element => {
            let list_data = fs.readFileSync(`${__dirname}/storage/renderComponent/lists/${element}.json`)
            toRendFile.push(
                [{
                    [element] : list_data.toString()
                }]
            )
        })
        //final render of objects
        let files = fs.readdirSync(`${__dirname}/storage/renderComponent/lists`)
        let files_f = []
        let files_f2 = []
        files.forEach(file => {
            let fileName = file.replace(`.json`, '').replace(`-prod`, '')
            let data = JSON.parse(fs.readFileSync(`${__dirname}/storage/renderComponent/lists/${fileName}.json`).toString())
            let data2 = JSON.parse(fs.readFileSync(`${__dirname}/storage/renderComponent/lists/${fileName}-prod.json`).toString())
            console.log(data + " fdfsf " + data2)
            data.forEach(el => {
                files_f.push(el)
            })
            data2.forEach(el => {
                files_f2.push(el);
            })
        })
        let files_final = [];
        for (let i = 0; i <= files_f.length; i++){
            files_final.push({
                [files_f[i]]: files_f2[i]
            })
        }
        let fData = {
            "listsList" : JSON.parse(renderList_),
            "listsData" : {
                "data" : toRendFile
            },
            "listsResponseData" : files_final
        }
        console.log(fData[0])
        fs.writeFile(`${__dirname}/storage/renderComponent/renderFinal.json`, JSON.stringify(fData) , {

        } ,function (err) {
            if (err)
                console.log(err)
        })
        console.log(files_final)
    }

    function queryCompare(query) {

    }

    function getResponseList(e) {
        let a = fs.readFileSync(`${__dirname}/storage/renderComponent/lists/${e}.json`).toString() //-prod
        a = JSON.parse(a)
        return createKeyBoard({a});
    }

    function createKeyBoard(data) { //object
        let i = [null]
        console.log(data)
        let a = data;
        return {
            parse_mode: "Markdown",
            resize_keyboard: true,
            reply_markup: {
                keyboard: a["a"].map(val => [{
                    text: val[0]
                }])
            }
        }
    }

    function getSheetsData() {

    }

}.call(this))
/**
 *
 * @event get_all_data: Получение полного списка данных из отдельных ф-й
 *
 * */    