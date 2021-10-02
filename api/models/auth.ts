import * as mongoose from "mongoose";;
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mobile: {type: Number, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    location: {type: String, required: true},
    userRole: {type: Number, required: true},
    aadhaar: {type: String},
    panCard: {type: String}
});

module.exports = mongoose.model('User', userSchema);
