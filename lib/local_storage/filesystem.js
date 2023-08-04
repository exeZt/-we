const fs = require("fs");
const mailer = require("../mailer");
(function () {
    const mailer = require("../mailer");
    module.exports = this.Storage = new class{
        createOrdersFile = (data) => {

            let filePath = `./lib/local_storage/orders/${getDate()}/${getDate()}.txt` || `../lib/local_storage/orders/${getDate()}/`;
            let foldPath = `./lib/local_storage/orders/${getDate()}/` || `../lib/local_storage/orders/${getDate()}/`;

            if (fs.existsSync(filePath)){

                let fileExistsData = fs.readFileSync(filePath, {
                    encoding : "utf-8"
                })

                let finalData = `\n ${fileExistsData}\n ${data} \n`

                fs.appendFileSync(filePath, `\n ${data}` , {
                    encoding : "utf-8"
                })

            } else {

                fs.mkdir(foldPath, {recursive : true}, function (err) {
                    if (err)
                        throw err
                })

                let new_fileData =
                    `Заказ карт ЛЦ Стахановская 7 группа \n\n
                    От СРКП: Коротченко Маргариты Анатольевны \n\n
                    ${data}`

                fs.writeFile(filePath, new_fileData , {
                    encoding : "utf-8"
                }, function (err) {
                    if(err)
                        throw err
                });
            }
            return "true";
        }

        checkOrderPackage = () => {
            let filePath = `./lib/local_storage/orders/${getDate()}/${getDate()}.txt`;
            if (fs.existsSync(filePath)){
                console.log(__dirname)
                let fileExistsData = fs.readFileSync(filePath, {
                    encoding : "utf-8"
                })
                return fileExistsData.toString();
            } else {
                return "нет заказа на сегодня"
            }
        }

        sendMailFromStorage = () => {
            let filePath = `./lib/local_storage/orders/${getDate()}/${getDate()}.txt`;
            if (!fs.existsSync(filePath)){
                console.log("FILE_NOT_EXISTS");
                return "FILE_NOT_EXISTS"
            }
            else {
                let fileExistsData = fs.readFileSync(filePath, {
                    encoding : "utf-8"
                })
                return mailer.sendMail(fileExistsData);
            }
        }
    }

    function getDate() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = dd + '-' + mm + '-' + yyyy;
        return today;
    }
}.call(this))

// Объяснительная начальнику группы Корецкой Елене Александровне
// я не работал 02.08.23 по причине отдыхал в выходной
// прошу прощения