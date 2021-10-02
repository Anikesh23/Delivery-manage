const errorService = require('../../services/error.service');
const Message = require('../models/message');
import mongoose from 'mongoose';
import { SocketHandlerService } from '../../services/socketHandler.service';

exports.getOldMessages = async (req: any, res: any) => {
    console.log('old');
     try {
         Message.find().or([{roomId: req.body.to + SocketHandlerService.encoderPayload + req.body.from}, {roomId: req.body.from + SocketHandlerService.encoderPayload + req.body.to}])
             .exec()
             .then((messages: any) => {
                res.status(200).json({
                    messages
                })
             });
     }
     catch (error) {
         errorService.returnError(req, res);
     }
};
