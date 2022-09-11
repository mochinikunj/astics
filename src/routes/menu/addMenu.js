const express = require('express');
const router = express.Router();

const { addMenu } = require('../../database/menu');

router.post('/', async (req, res) => {
    const body = req.body;
    console.log(body);

    // giving error response if category is not provides in the request
    if (!body.category) {
        return res.status(400).send({
            message: 'Please provide a category!'
        });
    }

    // save menu details in menu db
    // if menu stored successfuly then return success response, else return error
    try {
        const { uid, token } = req;
        const { category, item } = body;

        const menuAdded = await addMenu({ uid, category, item });
        res.send({ ...menuAdded, token });
    } catch (err) {
        res.status(400).send(err);
    }

});

module.exports = router;