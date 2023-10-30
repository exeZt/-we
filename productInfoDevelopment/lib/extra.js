global.XMLHttpRequest = require("xhr2");
//https://alfago.alfabank.ru/ufr-mot-ui/api/v2/motivation/general/userId/U_M1RCH?startDate=2023-09-01&endDate=2023-09-30
function getMotivation(uid, callback) {
    let e = new Date;
    let query_date_1 = `${e.getFullYear()}-${e.getMonth()}-01`;
    let query_date_2 = `${e.getFullYear()}-${e.getMonth()}-${e.getDay()}`;
    let x = new XMLHttpRequest();
    x.cookie = 'ad-token=vJDsUfndpPqAnt+I4HuZ9bf0zp2+gxum5XnWCZ9AVgT6m/vNW5+VOoDo9vsgWMzbqyuJ5WAiGRYO5zpxgk0XB5eTni5v3MoU0u2FxPdFTMfDs4PqVDt3y9UifBxLIW60+NFA8KPeU0hlGxob64hlWscL4revMCyAyFRYkVq9Hjxh6SXe+p5prHPNbT/YQ1scZ1dkWms4Rm6ZrZXjx+Ukphn9K45sFfj5cR3tmuO2YJzLsd/xVI0RgszN9Ho0KE54f8qMXpU/ehE4ORgDeENJqJBbLD/b1EWprMtmwaU5oaKzEXU1CBHxzbMlJU0vaCPFBcS8Uc9J1IuZ3itYdzACgwswVNGIO7VZ/HVuS7d0c6V9pwuzJ22iLlkwUyxFXg0Wmdn+07/3Lva4o31nC++IVEAI0oTNNtz26Fas8a7zpeka0oxNNOsf6uJIBUAQzhVmwGJdbBv1cuou8UFTu1soSHL/a0gCd7hIWDtmTakbRJFg19A6kQl8TflZTE9MEY8Krff1QFkytSNJ+RLHVLyt6DZSVPR1JHyNcdEAhoESGB5Sgbql4gqyjgZQnEr0kBeeLbLBtxJr/hS1Xs89FtwjRb9p6kz1ZQU1+v6p6ugX5Ze7GdbGiAkZ7+4kxmAjXPpULC8cwaoVFjtB80pkSR8gYv1Cd7MAvmold24otJ7Tvps='
    x.open('get', `https://alfago.alfabank.ru/ufr-mot-ui/api/v2/motivation/general/userId/${uid.toUpperCase()}?startDate=${query_date_1}&endDate=${query_date_2}`, true);
    x.send();
    x.onload = () => {
        if (x.status !== 200){
            callback(x.responseText);
        }else{
            callback(x.responseText);
        }
    }
}

module.exports = {
    getMotivation
}