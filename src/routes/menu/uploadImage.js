const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const { addImage } = require('./../../database/menu');

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/))
            return cb(new Error('Please upload an image'));

        cb(undefined, true);
    }
});

router.post('/', upload.single('categoryItem'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).toBuffer();
    const { itemName } = req.body;
    const { uid, token } = req;

    if (!itemName) {
        return res.status(400).send({ message: 'Please provide category name!' });
    }    

    try {
        const result = await addImage(uid, itemName, buffer);
        if (result.affectedRows !== 1) {
            return res.status(400).send({ message: 'User details incorrect!' });
        }
        
        res.send({uid, token});
    } catch (err) {
        res.status(500).send({ message: 'Server error while uploading image!' });
    }
}, (err, req, res, next) => {
    res.status(400).send({ message: err.message });
});

module.exports = router;