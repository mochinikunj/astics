const express = require('express');
const router = express.Router();

const { addMenu } = require('../../database/menu');

router.post('/', async (req, res) => {
    const body = req.body;
    console.log(body);

    if (!body.category) {
        return res.status(400).send({
            message: 'Invalid request!'
        });
    }

    try {
        const { uid, token } = req;
        const { category, item } = body;

        const menuAdded = await addMenu({ uid, category, item });
        res.status(200).send({ ...menuAdded, token });
    } catch (err) {
        res.status(400).send(err);
    }

});

module.exports = router;