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
    }
    function getUsersData() {
        let sName = 'userList'
        let sID = '1_91e43tN_Gi-FYvfawtN6kpUCZ7RT-0qPZK9k0ewmWI';
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select *';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        fetch(qUri)
            .then(r => r.text())
            .then(rd => {
                let data = JSON.parse(rd.substr(47).slice(0, -2))
                for (let i = 1; i < data.table.rows.length; i++){
                    dataFinal.push([{
                        username: data.table.rows[i].c[0].v,
                        uservks: data.table.rows[i].c[1].v,
                        usertg: data.table.rows[i].c[2].v
                    }])
                }
                console.log(dataFinal)
                if (!fs.existsSync(`${PathData.path_to_auth}users_data.json`)){
                    fs.mkdir(`${PathData.path_to_auth}`, { recursive: true} , function (e) {
                        if (e)
                            console.log(e)
                    })
                }
                fs.writeFile(`${PathData.path_to_auth}users_data.json`, JSON.stringify(dataFinal), function (err) {
                    if (err)
                        console.log(err)
                });
            })
        console.log("dataUpdated");
    }

    function getUsersDataShort() {
        let sName = 'userList'
        let sID = '1_91e43tN_Gi-FYvfawtN6kpUCZ7RT-0qPZK9k0ewmWI';
        let base = `https://docs.google.com/spreadsheets/d/${sID}/gviz/tq?`;
        let qRaw = 'Select C';
        let qRea = encodeURIComponent(qRaw);
        let qUri = `${base}&sheet=${sName}&tq=${qRea}`;
        let dataFinal = []
        let dataShort = []
        fetch(qUri)
            .then(r => r.text())
            .then(rd => {
                let data = JSON.parse(rd.substr(47).slice(0, -2))
                for (let i = 1; i < data.table.rows.length; i++){
                    dataFinal.push(data.table.rows[i].c[0].v)
                }
                console.log(dataFinal)
                if (!fs.existsSync(`${PathData.path_to_auth}`)){
                    fs.mkdir(`${PathData.path_to_auth}`, { recursive: true} , function (e) {
                        if (e)
                            console.log(e)
                    })
                }
                fs.writeFile(`${PathData.path_to_auth}users_data_s.json`, JSON.stringify(dataFinal), function (err) {
                    if (err)
                        console.log(err)
                });
            })
        return fs.readFileSync(`${PathData.path_to_auth}users_data_s.json`).toString()
        console.log("dataUpdated_short");
    }

    function _getUsersData () {
        return fs.readFileSync(`${PathData.path_to_auth}users_data.json`).toString()
    }
}.call(this))