require("dotenv").config();
const mongoose = require("mongoose");
const { MONGODB_HOST, MONGODB_PORT, MONGODB_DB, TIME_INTERVAL } = process.env;
const express = require("express");
const { getUpdateRows } = require("./Components/Helpers");
const { AllData } = require("./Components/BD/Cruds/Datasets");
const app = express();
app.get("/");
app.listen(3003, () => console.log("Server Ready"));

mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => console.log("conectado")).catch((e) => console.log(e));
setInterval(() => {
    getUpdateRows();
    console.log("Update")
}, TIME_INTERVAL);

app.get("/test", async function (req, res) {
    const { sports, date, tournament } = req.query;
    let resp = [];
    if (sports) {
        let results = [];
        await Promise.all(sports.split(",").map(async (id) => {
            var filter = {
                sportId: id,
            };
            await AllData().then(r => {
                let filtro = r.filter(function (item) {
                    for (var key in filter) {
                        if (item[key] === undefined || item[key] != filter[key])
                            return false;
                    }
                    return true;
                });
                return results = results.concat(filtro);
            })
        }))
        resp = resp.concat(results)
    }

    if (date) {
        if (resp.length > 0) {
            const regex = new RegExp(`/${date}\\b`);
            // const matchedSites = resp.filter((r) => regex.test(r.startTime));
            // console.log(matchedSites)
            const fitered = resp.filter((item) => {
                return item.startTime.split(' ').some((part) => part.includes(date));
            });
            resp = fitered;
        } else {

        }
    }

    res.json(resp)
})