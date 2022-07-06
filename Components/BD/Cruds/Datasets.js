const Datasets = require("../Models/Datasets");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
exports.AllData = async function (datos) {
    let result = await Datasets.find(datos);
    return result;
}

exports.AddData = async function (datos) {
    if (datos) {
        const NewItem = new Datasets(datos);
        const ItemSave = await NewItem.save();
        if (ItemSave.__v === 0) {
            return ItemSave._id;
        }
    } else {
        return false;
    }
}

exports.DropData = async (guild) => {
    if (guild) {
        const ItemELiminado = await Datasets.deleteMany({ guild: guild })
        if (ItemELiminado.deletedCount === 1 && ItemELiminado.n === 1) {
            return true;
        }
    } else {
        return false;
    }
}

exports.UpdateData = async function (datos) {
    if (datos) {
        let id = datos._id;
        delete datos._id;
        const ItemUpdate = await Datasets.updateOne({ _id: ObjectId(id) }, datos)
        if (ItemUpdate.nModified === 1 && ItemUpdate.n === 1) {
            return true;
        }
    } else {
        return false;
    }
}
