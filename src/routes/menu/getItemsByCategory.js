const express = require('express');
const router = express.Router();

const { getItemsByCategory } = require('./../../database/menu');

router.post('/', async (req, res) => {
    const uid = req.uid;
    const { category } = req.body;

    // give error response if category is no provided to get items
    if (!category) {
        return res.status(400).send({ message: 'Please provide a category!' });
    }

    // calling function to get items with given category
    // returning success response if items fetching is successful, else return error
    try {
        const items = await getItemsByCategory(uid, category);
        res.send(items);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;