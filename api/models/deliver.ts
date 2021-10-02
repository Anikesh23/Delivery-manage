import * as mongoose from "mongoose";;
const deliverSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: String, required: true, unique: true},
    location: {type: String, required: true},
    deliveryStatus: {type: Boolean, required: true},
});

module.exports = mongoose.model('Deliver', deliverSchema);
