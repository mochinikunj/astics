const express = require('express');
const router = express.Router();
const validator = require('validator');

const { addUser } = require('./../../database/user');

router.post('/', async (req, res) => {
    const body = req.body;

    // gethering user infromation from request
    const user = {
        firstName: body.firstName,
        lastName: body.lastName,
        mobileNumber: body.mobileNumber,
        email: body.email,
        password: body.password
    };

    // checking if user data is valid, giving error response if user is invalid
    if (isValidUserData(user)) {
        try {
            // calling function to add user in db
            const insertUser = await addUser(user);
            if (!insertUser) {
                throw new Error({
                    message: 'DB error!'
                });
            }

            // giving success response if user data is valid
            res.send(insertUser);
        } catch (err) {
            // giving error response if server error occurs
            res.status(500).send(err);
        }
    } else {
        res.status(400).send({ message: 'Invalid request!' });
    }
});

// function returns true if user data is valid, else false
function isValidUserData(user) {
    return !validator.isEmpty(user.firstName) &&
        !validator.isEmpty(user.lastName) &&
        validator.isMobilePhone(user.mobileNumber) && 
        validator.isEmail(user.email) &&
        validator.isStrongPassword(user.password);
}

module.exports = router;