import jwt from 'jsonwebtoken';
// Get Auth code
exports.getAuth = (user: any) => jwt.sign({
    email: user.email,
    userId: user._id
},
    process.env.JWT_KEY ? process.env.JWT_KEY : 'yourWishMasterInTheHouseSecret', {
    expiresIn: "4h"
});

exports.generateOTP = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
