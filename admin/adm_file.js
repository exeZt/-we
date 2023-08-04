"use strict";

const fs = require("fs"),
    mailer = require("../lib/mailer");
const {reject} = require("nodemailer/.ncurc");
(function () {
    module.exports = this.AdminCommandsClass = new class{

        checkOrderPackageAdmin = () => {
            if (!fs.existsSync(`./lib/local_storage/orders/${getDate()}/${getDate()}.txt`)){
                return "no_data";
            }else {
                let filePath = `./lib/local_storage/orders/${getDate()}/${getDate()}.txt`;
                let fileExistsData = fs.readFileSync(filePath, {
                    encoding : "utf-8"
                })
                return fileExistsData.toString();
            }
        }

        sendMailFromStorageAdmin = () => {
            let filePath = `./lib/local_storage/orders/${getDate()}/${getDate()}.txt`;
            if (!fs.existsSync(filePath))
                console.log("FILE_NOT_EXISTS");
            else {
                let fileExistsData = fs.readFileSync(filePath, {
                    encoding : "utf-8"
                })
                let a;
                mailer.sendMail(fileExistsData)
                    .then(r => console.log(r));
            }
        }
    }
    function getDate() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '-' + dd + '-' + yyyy;
        return today;
    }
}.call(this))