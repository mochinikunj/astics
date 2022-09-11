const express = require('express');
const router = express.Router();
const validator = require('validator');
const { checkUserCrednetials } = require('./../../database/user');

router.post('/', async (req, res) => {
    const body = req.body;

    // gethering user credentials from request
    const user = {
        email: body.email,
        password: body.password
    };

    // checking if user data is valid, giving error response if user is invalid
    if (isValidUserData(user)) {
        try {
            // check if user is valid from DB and return jwt if success
            const userData = await checkUserCrednetials(user);

            // giving success response if user data is valid
            res.status(200).send(userData);
        } catch (err) {
            // giving error response if error occurs
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({ message: 'Invalid request!' });
    }
});

// function returns true if user credenatials are valid, else false
function isValidUserData(user) {
    return validator.isEmail(user.email) && validator.isStrongPassword(user.password);
}

module.exports = router;