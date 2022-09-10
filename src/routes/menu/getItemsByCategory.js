const express = require('express');
const router = express.Router();

const { getItemsByCategory } = require('./../../database/menu');

router.post('/', async (req, res) => {
    const uid = req.uid;
    const { category } = req.body;

    if (!category) {
        return res.status(400).send({ message: 'Please provide a category!' });
    }

    try {
        const items = await getItemsByCategory(uid, category);
        res.send(items);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;