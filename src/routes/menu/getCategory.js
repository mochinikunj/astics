const express = require('express');
const router = express.Router();

const { getCategory } = require('./../../database/menu');

router.get('/', async (req, res) => {
    // getting uid
    const uid = req.uid;

    // calling function to get all categories associated with given uid
    // returns success response if success while fetching category, else return error
    try {
        const categories = await getCategory(uid);
        res.send(categories);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;