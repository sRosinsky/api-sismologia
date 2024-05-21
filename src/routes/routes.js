const cheerio = require('cheerio');
const Router = require('express');
const request = require("request-promise")
const router = Router();
const moment = require('moment');
let arrayDatosFinal
router.get('/api/last', (req, res) => {    

function consulta() {

    function formatUrl() {

        let fullYear = moment().format("YYYYMMDD");
        let year = moment().format("YYYY");
        let month = moment().format("MM")
        let url = `https://www.sismologia.cl/sismicidad/catalogo/${year}/${month}/${fullYear}.html`
        scrapper(url)
    
    }
    
    formatUrl()
    async function scrapper(pageUrl) {

        const res = await request(pageUrl);
        const $ = cheerio.load(res);
        const all_tr = $("tr").next().first()
        first_tr_text = all_tr.text()
        const first_td = $("tr").next().first().find("a");
        first_td_tr_text = first_td.text()


        arrayDatos1 = first_td_tr_text.split(" ")
        arrayDatos2 = first_tr_text.split("\n")
        fechaHoraUTC = arrayDatos2[2].slice(14);
        fechaHoraUTCArray = fechaHoraUTC.split(" ");
        latLon = arrayDatos2[3].slice(14);
        latLonArray = latLon.split(" ")

        latitud = latLonArray[0]
        longitud = latLonArray[1]
        fechaLocal = arrayDatos1[0];
        horaLocal = arrayDatos1[1];
        fechaUtc = fechaHoraUTCArray[0]
        horaUtc = fechaHoraUTCArray[1]
        ubicacion = arrayDatos2[1].slice(33);
        profundidad = arrayDatos2[4].slice(14);
        magnitud = arrayDatos2[5].slice(14);

        arrayDatosFinal = [latitud, longitud, fechaUtc, horaUtc, fechaLocal, horaLocal, ubicacion, profundidad, magnitud]
    }

res.json(

            {
                "Latitud": `${arrayDatosFinal[0]}`,
                "Longitud": `${arrayDatosFinal[1]}`,
                "fechaUtc": `${arrayDatosFinal[2]}`,
                "horaUtc": `${arrayDatosFinal[3]}`,
                "fechaLocal": `${arrayDatosFinal[4]}`,
                "horaLocal": `${arrayDatosFinal[5]}`,
                "ubicacion": `${arrayDatosFinal[6]}`,
                "profunidad": `${arrayDatosFinal[7]}`,
                "magnitud": `${arrayDatosFinal[8]}`,
            }
        );
    }
    
consulta()
setInterval(consulta(), 550000)
}
)
module.exports = router;