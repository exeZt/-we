(function () {
    "use strict";
    const {
            NetworkDataId ,
            PathData
        } = require("./config"),
        fs = require("fs")

    module.exports = this.Security = new class{
        getDataAuth_user = function () {
            return getUsersDataShort()
        }
        getUdata = function () {
            getUsersData()
        }
        isBanned = function (uname, callback) {
            _isBanned(uname, function (e) {
                console.log(e + ' --banned')
                callback(e)
            })
        }
        isAdmin = function (uname, callback) {
            _isAdmin(uname, function (e) {
                console.log(e + ' --admin')
                callback(e)
            })
        }
    }

    function _isBanned(username, callback) {
        let sName = 'banList'
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
            try {
                let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
                for (let i = 1; i < data.table.rows.length; i++) {
                    try {
                        dataFinal.push([{
                            username: data.table.rows[i].c[0].v,
                            uservks: data.table.rows[i].c[1].v,
                            usertg: data.table.rows[i].c[2].v
                        }])
                    } catch (e) {}
                }
                if (!fs.existsSync(`${PathData.path_to_auth}`)) {
                    fs.mkdir(`${PathData.path_to_auth}`, {recursive: true}, function (e) {
                    })
                }
                fs.writeFile(`${PathData.path_to_auth}banned_users_data.json`, JSON.stringify(dataFinal), function (err) {
                });
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
            }
        }
    }

    function _isAdmin(username, callback) {
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
                    try {
                        dataFinal.push([{
                            username: data.table.rows[i].c[0].v,
                            uservks: data.table.rows[i].c[1].v,
                            usertg: data.table.rows[i].c[2].v
                        }])
                    }
                    catch (e) {
                    }
                }
                if (!fs.existsSync(`${PathData.path_to_auth}`)){
                    fs.mkdir(`${PathData.path_to_auth}`, { recursive: true } , function (e) {
                    })
                }
                fs.writeFile(`${PathData.path_to_auth}admins_users_data.json`, JSON.stringify(dataFinal), function (err) {
                });
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
            }
        }
    }

    function getUsersData() {
        let sName = 'membersList'
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
            try {
                let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
                for (let i = 1; i < data.table.rows.length; i++){
                    try {
                        dataFinal.push([{
                            username: data.table.rows[i].c[0].v,
                            uservks: data.table.rows[i].c[1].v,
                            usertg: data.table.rows[i].c[2].v
                        }])
                    }
                    catch (e) {
                    }
                }
                if (!fs.existsSync(`${PathData.path_to_auth}`)){
                    fs.mkdir(`${PathData.path_to_auth}`, { recursive: true} , function (e) {
                    })
                }
                fs.writeFile(`${PathData.path_to_auth}users_data.json`, JSON.stringify(dataFinal), function (err) {
                });
            }catch (e) {
            }
        }
    }

    function getUsersDataShort() {
        let sName = 'membersList'
        let sID = NetworkDataId.table_auth;
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select C';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let dataShort = []
        let xhr = new XMLHttpRequest();
        xhr.open('get', qUri, true)
        xhr.send()
        xhr.onload = () => {
            let data = JSON.parse(xhr.responseText.substr(47).slice(0, -2))
            for (let i = 1; i < data.table.rows.length; i++){
                dataFinal.push(data.table.rows[i].c[0].v)
            }
            if (!fs.existsSync(`${PathData.path_to_auth}`)){
                fs.mkdir(`${PathData.path_to_auth}`, { recursive: true} , function (e) {
                })
            }
            fs.writeFile(`${PathData.path_to_auth}users_data_s.json`, JSON.stringify(dataFinal), function (err) {
            });
        }
        return fs.readFileSync(`${PathData.path_to_auth}users_data_s.json`).toString()
    }
}.call(this))