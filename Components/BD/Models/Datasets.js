const { Schema, model } = require("mongoose");

const DatasetSchema = new Schema({
    id: { type: String, trim: true, required: true },
    idAsString: { type: String, trim: true, required: true },
    sportId: { type: Number, trim: true, required: true },
    sport: { type: String, trim: true, required: true },
    tournament: { type: String, trim: true, required: true },
    location: { type: String, trim: true, required: true },
    home: { type: String, trim: true, required: true },
    away: { type: String, trim: true, required: true },
    startTime: { type: String, trim: true, required: true }
});

module.exports = model("Datasets", DatasetSchema)