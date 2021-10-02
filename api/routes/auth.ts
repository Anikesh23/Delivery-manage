import express from 'express';
const router = express.Router();
const UserController = require('../controllers/auth');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, file.fieldname === 'aadhaar' ? './uploads/aadhaar' : './uploads/pan-card');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileSizeInKb = 200;
const fileFilter = (req: any, file: { mimetype: string; mimeType: string; }, cb: (arg0: Error | null, arg1: boolean) => any) => {
    // Reject file
    file.mimetype === 'image/jpeg' || file.mimeType === 'image/png' ?
        cb(null, true) : cb(new Error(`Image can\'t be uploaded, file size should not exceed ${fileSizeInKb}`), false);
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * fileSizeInKb
    },
    fileFilter
});


router.get('', UserController.getAllUser);
router.post('/login', UserController.login);
router.post('/register', upload.fields([{
    name: 'aadhaar', maxCount: 1 }, {name: 'panCard', maxCount: 1}]), UserController.register);
router.delete('/:userId', UserController.deleteUser);
router.post('/verify', UserController.verifyOtp);
router.post('/keepAuthenticated', UserController.keepAuthenticated);

module.exports = router;
