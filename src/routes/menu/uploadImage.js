const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const { addImage } = require('./../../database/menu');

// middlware of multer
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            // callback calling with error
            return cb(new Error('Please upload an image'));
        }

        // callback calling with success
        cb(undefined, true);
    }
});

router.post('/', upload.single('categoryItem'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).toBuffer();
    const { itemName } = req.body;
    const { uid, token } = req;

    // give error response if itemName is no provided to upload an image
    if (!itemName) {
        return res.status(400).send({ message: 'Please provide item name!' });
    }    

    // calling addImage function to store an image in db
    // return success if image stored successfuly, else return error response
    try {
        const result = await addImage(uid, itemName, buffer);

        // giving error response if user details are incorrect
        if (result.affectedRows !== 1) {
            return res.status(400).send({ message: 'User details incorrect!' });
        }
        
        res.send({uid, token});
    } catch (err) {
        res.status(500).send({ message: 'Server error while uploading image!' });
    }
}, (err, req, res, next) => {
    // giving error if any issue happens while storing image
    res.status(400).send({ message: err.message });
});

module.exports = router;