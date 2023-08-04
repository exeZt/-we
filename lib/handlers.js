(function () {
    let access_list = {
        "svk": [

        ],
        "srkp":[

        ],
        "ng":[

        ]
    }
    let parser = {
        "parser_code" : [
            ["ДКС", "Кросс стикеры: "],
            ["ЗПК", "Кросс зарплатные карты: "],
            ["КДК" , "Кросс дебетовые карты: "],
            ["ККК" , "Кросс кредитные карты: "],
            ["СДК" , "Селфи дебетовые карты: "],
            ["СКК" , "Селфи кредитные карты: "],
            ["КДКх5_5" , "Кросс дебетовые карты х5 пятёрочка"],
            ["КККх5_5" , "Кросс кредитные карты х5 пятёрочка"],
            ["КДКх5_4" , "Кросс дебетовые карты х5 перекресток"],
            ["КККх5_4" , "Кросс кредитные карты х5 перекресток"]
        ],
        "parser_settings" : {
            "CR_DK_C": {
                "code" : "КДК",
                "name" : "Кросс дебетовые карты: "
            },
            "CR_KK_C" : {
                "code" : "ККК",
                "name" : "Кросс кредитные карты: "
            },
            "SR_DK_C" : {
                "code" : "СДК",
                "name" : "Селфи дебетовые карты: "
            },
            "SR_KK_C" : {
                "code" : "СКК",
                "name" : "Селфи кредитные карты: "
            },
            "X5_DK_5" : {
                "code" : "КДКх5_5",
                "name" : "Кросс дебетовые карты х5 пятёрочка"
            },
            "X5_KK_5" : {
                "code" : "КККх5_5",
                "name" : "Кросс кредитные карты х5 пятёрочка"
            },
            "X5_DK_4" : {
                "code" : "СКК",
                "name" : "Селфи кредитные карты: "
            },
            "X5_KK_4" : {
                "code" : "СКК",
                "name" : "Селфи кредитные карты: "
            }
        }
    }
    const cfg = require("../config.json");
    module.exports = this.EventHandlerClass = new class{
        onCreatedPackage = () => {
            return {
                reply_markup : {
                    keyboard : [
                        [{
                            text : 'Подтвердить',
                            type : 'ok',
                            id : generateId()
                        }],
                    ]
                }
            }
        }

        onCreatePackage = async (message_text) => {
            if (!message_text)
                console.error("no @param 1")
            message_text.toLowerCase();
            let wrd = message_text.split(`=`);
            let array1 = [];
            for (let i = 0; i <= wrd.length; i++){
                array1.push(wrd[i]);
            }
            const clientData = { "Name" : wrd[0] , "Id" : "1" }

            return await formattingOrder(orderParser(array1))
        }
        onHelpRequired = () => {
            return cfg.help_info;
        }
    }
    function generateId() {
        return Math.floor(Math.random() * 100) * Math.floor(Math.random() * 100)
            / Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100);
    }
    function orderParser(data) {
        let parsed_data = [];
        let svk_name;
        let parsed_data2 = [];
        console.log(data)
        let i  = 0;
        data.forEach(element => {
            if (element === undefined) {
                console.log("undefined received")
            }else {
                let elTemp = element.replace(/=(\r\n|\n|\r)/gm, '')
                console.log(elTemp)
                parsed_data.push(elTemp)
            }
        });
        svk_name = parsed_data[0];
        console.log("svk_name:: " + svk_name)
        parsed_data.slice(0,1);
        parsed_data.forEach(element => {
            let a = element.split('-')
            parsed_data2.push(a);
        });
        console.log("-----------------------")
        console.log(parsed_data2)
        console.log("-----------------------")
        return parsed_data2;
    }
    async function formattingOrder(order_array) {
        console.log("=======================[formatter]=======================start")
        let orderParsed = [];
        let orderFinal;
        let svk_name = order_array[0][0]
        let count = 0;
        console.log(svk_name)
        console.log(parser.parser_code[0][1])
        order_array.forEach(element => {
            parser.parser_code.forEach(element1 => {
                let elem1 = element[0].replace(' ', '').trim();
                let elem2 = element1[0].replace(' ', '').trim();
                let res = null;
                console.log(`${elem1} / ${elem2}`);
                if (elem1 === elem2) {
                    console.log(true)
                    res = `${element1[1].replace(',', '')} : ${element[1].replace(' ', '').trim()}`;
                    orderParsed.push(`${res.toString().replace(',', '').trim().replace(",", "")}\n`);
                }
            })
            count++;
            console.log(count)
        })
        orderFinal = `${svk_name} \n ${orderParsed}`

        console.log("=======================[formatter]=======================end")

        return orderFinal;
    }

    function encode_utf8(s) {
        return unescape(encodeURIComponent(s));
    }

    function decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }
}.call(this))
/*
    Новиков Михаил Андреевич
    Кросс дк - 15 шт
    Селфи дк - 15 шт
    Кросс дк х5 Пятерочка- 15 шт
    Кросс дк х5 Перекрёсток - 15 шт
    Кросс кк х5 пятёрочка-10 шт
    Кросс кк х5 Перекрёсток- 10 шт

    to

    Новиков Михаил Андреевич=
    КДК - 15 =
    СДК - 15 =
    КДКх5 - 15 =
    КДКх5 - 15 =
    КККх5 - 10 =
    КККх5 - 10
//
// Новиков Михаил Андреевич=
// КДК - 15 =
// СДК - 15 =
// КДКх5 - 15 =
// КДКх5 - 15 =
// КККх5 - 10 =
// КККх5 - 10
 */