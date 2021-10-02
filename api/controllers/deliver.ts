const errorService = require('../../services/error.service');
const Deliver = require('../models/deliver');
import mongoose from 'mongoose';

exports.setDelievryStatus = async (req: any, res: any) => {
    const getDeliveryStatusMessage = (deliveryStatus: any) => `your status is turned ${deliveryStatus ? 'on' : 'off'}`
    const isSet = await Deliver.find({ userId: req.body.userId });
    if (isSet.length === 0) {
        const deliveryStatus =
        {
            _id: mongoose.Types.ObjectId(),
            userId: req.body.userId,
            location: req.body.location,
            deliveryStatus: req.body.deliveryStatus
        };
        const newDelivery = new Deliver(deliveryStatus);
        newDelivery.save().then((result: any) => {
            return res.status(200).json({
                message: getDeliveryStatusMessage(result.deliveryStatus),
                deliveryStatus: result.deliveryStatus
            });
        }).catch((err: any) => {
            return errorService.returnError(res, err);
        });
    }
    else {
        const filter = { userId: req.body.userId };
        const update = {
             deliveryStatus: req.body.deliveryStatus,
             location: req.body.location
         };

        // `doc` is the document _after_ `update` was applied because of
        // `new: true`
        try {
            let doc = await Deliver.findOneAndUpdate(filter, update, {
                new: true,
                useFindAndModify: false
            });
            return res.status(200).json({
                message: getDeliveryStatusMessage(doc.deliveryStatus),
                deliveryStatus: doc.deliveryStatus
            });
        }
        catch (error) {
            return res.status(401).json({
                message: 'Failed to set your delivery status'
            });
        }
    }
};
