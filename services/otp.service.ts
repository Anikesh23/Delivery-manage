import axios from "axios";

exports.sendOtp = (mobileNumber: number, otp: number) => {
   return axios.get(`https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/${mobileNumber}/${otp}/Demo`);
}

 exports.verifyOtp = (otp: number, sessionId: number) => {
    return axios.get(`https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`);
 }
