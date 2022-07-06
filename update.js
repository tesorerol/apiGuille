require("dotenv").config();
const mongoose = require("mongoose");
const { getUpdateRows } = require("./Components/Helpers");
const { MONGODB_HOST, MONGODB_PORT, MONGODB_DB, TIME_INTERVAL } = process.env;
mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => console.log("conectado")).catch((e) => console.log(e));

getUpdateRows();