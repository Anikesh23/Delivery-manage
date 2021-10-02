const User = require('../models/auth');
import mongoose from 'mongoose';
const otpService = require('../../services/otp.service');
const errorService = require('../../services/error.service');
const authService = require('../../services/auth.service');

//GET ALL USER CONTROLLER
exports.getAllUser = (req: any, res: any) => {
    User.find()
        .select("_id email aadhaar panCard")
        .exec()
        .then((users: any) => {
            return res.status(200).json({
                users: users
            });
        })
        .catch((err: any) => errorService.returnError(res, err));
};

//LOGIN CONTROLLER
exports.login = (req: any, res: any) => {
    otpService.sendOtp(req.body.mobile, authService.generateOTP()).then((response: any) => {
        if (response) {
            return res.status(201).json({
                message: 'Your otp is sent',
                serviceId: response.data.Details
            });
        }
        return res.status(500).json({
            message: 'Incorrect phone number'
        });
    }).catch((err: any) => {
        throw err;
    });
};

//REGISTER CONTROLLER
exports.register = async (req: any, res: any) => {
    const user = await User.find({ email: req.body.email, mobile: req.body.mobile });
    if (user.length === 0) {
        console.log(req.files.aadhaar && req.files.panCard);
        const info = req.files.aadhaar && req.files.panCard ?  {
            _id: mongoose.Types.ObjectId(),
            mobile: req.body.mobile,
            name: req.body.name,
            email: req.body.email,
            location: req.body.location,
            userRole: req.body.userRole,
            aadhaar: req.files.aadhaar[0].path,
            panCard: req.files.panCard[0].path
        }  :
            {
                _id: mongoose.Types.ObjectId(),
                mobile: req.body.mobile,
                name: req.body.name,
                email: req.body.email,
                location: req.body.location,
                userRole: req.body.userRole
            };
        const newUser = new User(info);
        newUser.save().then((result: any) => {
            return res.status(200).json({
                message: 'you have successfully registered',
                user: newUser,
                auth: authService.getAuth(result)
            });
        }).catch((err: any) => {
            console.log(err);
            errorService.returnError(res, err)
        });
    }
    else {
        return res.status(500).json({
            message: 'User exists'
        });
    }

};

//DELETE USER CONTROLLER
exports.deleteUser = (req: any, res: any) => {
    User.deleteOne({ _id: req.params.userId }).exec()
        .then(() => {
            return res.status(200).json({
                message: 'User deleted'
            });
        }).
        catch((err: any) => errorService.returnError(res, err));

};

//VERIFY OTP
exports.verifyOtp = (req: any, res: any) => {

    otpService.verifyOtp(req.body.otp, req.body.serviceId).then((response: any) => {
        if (response) {
            User.find({ mobile: req.body.mobile })
                .exec()
                .then((user: any) => {
                    console.log(user);
                    return res.status(200).json({
                        message: 'Otp is verified',
                        user,
                        auth: user.length > 0 ? authService.getAuth(user[0]) : ''
                    });
                })
                .catch((err: any) => {
                    return res.status(401).json({
                        error: err
                    });
                });
        }
        else {
            return res.status(500).json({
                message: 'Your Otp could not be verified.'
            });
        }

    }).catch((err: any) => errorService.returnError(res, err));
};


//KEEP AUTHENTICATED CONTROLLER
exports.keepAuthenticated = (req: any, res: any) => {
    User.find({ mobile: req.body.mobile })
    .exec()
    .then((user: any) => {
        return res.status(200).json({
            message: `You are ${user.length > 0 ? '': 'not'} authenticated`,
            auth: user.length > 0 ? authService.getAuth(user[0]) : ''
        });
    })
    .catch((err: any) => {
        return res.status(401).json({
            error: err
        });
    });

};


