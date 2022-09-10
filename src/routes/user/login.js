const express = require('express');
const router = express.Router();
const validator = require('validator');
const { checkUserCrednetials } = require('./../../database/user');

router.post('/', async (req, res) => {
    const body = req.body;

    const user = {
        email: body.email,
        password: body.password
    };

    if (isValidUserData(user)) {
        // check if user is valid from DB and return jwt
        try {
            const userData = await checkUserCrednetials(user);
            res.status(200).send(userData);
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({
            message: 'Invalid request!'
        });
    }
});

function isValidUserData(user) {
    return validator.isEmail(user.email) && validator.isStrongPassword(user.password);
}

module.exports = router;