"use strict";
(function () {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
        host: "smtp.mail.ru",
        port: 465,
        secure: true,
        auth: {
            user: 'webchatio@internet.ru',
            pass: 'gSmzKvwRuwkwiBVbGdNk'
        }
    });

    /**
     * TODO : CHANGE MAIL AND FIND SMTP ALFABANK
     * */

    module.exports = this.Mailer = new class {
        sendMail = async (data) => {
            const info = await transporter.sendMail({
                from: 'Коротченко Маргарита Анатольевна <webchatio@internet.ru>',
                to: "piskariov576@gmail.com",
                subject: "Заказ карт 7-я группа",
                text: data, // plain text body
            });
            console.log("Отправлено в ЛЦ", info.messageId);
            return "Отправлено в ЛЦ " + info.messageId;
        }
    }
}.call(this))