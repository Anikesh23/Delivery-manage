import * as mongoose from "mongoose";;
const IFrom = new mongoose.Schema({
    id: String,
    name: String
});

const messageSchema = new mongoose.Schema({
    from: {type: IFrom, required: true},
    to: {type: String, required: true},
    message: {type: String, required: true},
    isRead: {type: Boolean, required: true},
    roomId: {type: String, required: true},
    timeStamp: {type: Date, required: true}
});

module.exports = mongoose.model('Message', messageSchema);
