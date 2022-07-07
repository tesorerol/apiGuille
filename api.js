require("dotenv").config();
const mongoose = require("mongoose");
const { MONGODB_HOST, MONGODB_PORT, MONGODB_DB, TIME_INTERVAL } = process.env;
const express = require("express");
const { getUpdateRows } = require("./Components/Helpers");
const { AllData } = require("./Components/BD/Cruds/Datasets");
const app = express();
var fs = require('fs');
const https = require("https");
const cors = require("cors");
const PORT = 3003;
var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.tesotein.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.tesotein.com/cert.pem'),
};

const server = https.createServer(options, app);
/**** Descomenta si quieres ambiente de produccion******/

const whitelist = ["*"]
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))
// const http = require("http");

// const server = http.createServer(app);
server.listen(PORT, () => console.log('server On ' + PORT));

mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => console.log("conectado")).catch((e) => console.log(e));

setInterval(async () => {
    await getUpdateRows();
    console.log("Update")
}, TIME_INTERVAL);

app.get("/", (req, res) => {
    res.send("GG")
})

app.get("/getMatches", async function (req, res) {
    const { sports, date, tournament } = req.query;
    let resp = [];
    if (sports) {
        let results = [];
        await AllData().then(async r => {
            await Promise.all(sports.split(",").map(async (id) => {
                var filter = {
                    sportId: id,
                };

                let filtro = r.filter(function (item) {
                    for (var key in filter) {
                        if (item[key] === undefined || item[key] != filter[key])
                            return false;
                    }
                    return true;
                })
                return results = results.concat(filtro);
            }))
        });
        resp = resp.concat(results)
    }

    if (date) {
        if (resp.length > 0) {
            const regex = new RegExp(`/${date}\\b`);
            const fitered = resp.filter((item) => {
                return item.startTime.split(' ').some((part) => part.includes(date));
            });
            resp = fitered;
        } else {

        }
    }

    res.json(resp)
})