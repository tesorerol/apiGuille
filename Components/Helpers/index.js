const axios = require("axios");
const { AddData, AllData, UpdateData } = require("../BD/Cruds/Datasets");

exports.getUpdateRows = async function () {
    console.time();
    await axios.get('https://om-fixtures.oddsmatrix.com/matches')
        .then(async response => {
            await Promise.all(
                response.data.map(async (r) => {
                    // console.log(r)
                    let exist = await AllData({ idAsString: r.idAsString });
                    if (exist.length > 0) {
                        await UpdateData({ ...r, _id: exist._id });
                        console.log("Actualizado");
                    } else {
                        await AddData(r);
                        console.log("Agregado");
                    }
                }));
            console.timeEnd();
        }).catch(async r => {
            console.log("error")
            console.log(r)
        })

}


