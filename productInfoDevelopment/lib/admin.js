(function () {
    const {
            NetworkDataId,
            PathData,
            HelpList,
            AuthLists
        } = require('./config'),
        fs = require('fs')
    module.exports = this.Admin = new class {
        _help = function () {
            let s = '';
            HelpList.forEach(el => {
                s += `${el} \n`
            })
            return s;
        }
        _getfilelist = function () {
            try {
                let a = fs.readdirSync(PathData.path_to_files)
                return {
                    'content' : a,
                    'path' : AuthLists.path_to_members
                };
            } catch (e) {
                console.log(e)
            }
        }
        _getadminlist = function () {
            try {
                let a = fs.readFileSync(AuthLists.path_to_admins)
                return {
                    'content' : a,
                    'path' : AuthLists.path_to_admins
                };
            } catch (e) {
                console.log(e)
            }
        }
        _refresh_data = function () {
            DataHandler.refreshData();
        }
        _getmemberslist = function () {
            try {
                let a = fs.readFileSync(AuthLists.path_to_members)
                return {
                    'content' : a,
                    'path' : AuthLists.path_to_members
                };
            } catch (e) {
            }
        }
        _getbanlist = function () {
            try {
                let a = fs.readFileSync(AuthLists.path_to_banned)
                return {
                    'content' : a,
                    'path' : AuthLists.path_to_banned
                };
            } catch (e) {
            }
        }
        _getLogFile = function () {
            let date = new Date();
            let a = fs.readFileSync(`${PathData.path_to_logs}/${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()}.txt`);
        }
    }
}.call(this))