const axios = require("axios");
const moment = require('moment-timezone');
const { AddData, AllData, UpdateData } = require("../BD/Cruds/Datasets");

function FormatFecha(fecha) {
    const d = new Date(fecha)
    return moment(d).tz("America/New_York").format('YYYY-MM-D HH:mm:ss');
}




exports.getUpdateRows = async function () {
    await axios.get('https://om-fixtures.oddsmatrix.com/matches')
        .then(async response => {
            new Promise((resolve, reject) => {
                response.data.map(async (r) => {
                    // console.log(r)
                    let exist = await AllData({ idAsString: r.idAsString });
                    if (exist.length > 0) {
                        await UpdateData({ ...r, _id: exist._id, timeEST: FormatFecha(r.startTime) });
                    } else {
                        await AddData({ ...r, timeEST: FormatFecha(r.startTime) });
                    }
                })
                console.log("listo")
                resolve(true);
            });
        }).catch(async r => {
            console.log("error")
            console.log(r)
        })

}


