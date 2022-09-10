const express = require('express');
const router = express.Router();

const { getCategory } = require('./../../database/menu');

router.get('/', async (req, res) => {
    const uid = req.uid;

    try {
        const categories = await getCategory(uid);
        res.send(categories);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;