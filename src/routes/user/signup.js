const express = require('express');
const router = express.Router();
const validator = require('validator');

const { addUser } = require('./../../database/user');

router.post('/', async (req, res) => {
    const body = req.body;

    const user = {
        firstName: body.firstName,
        lastName: body.lastName,
        mobileNumber: body.mobileNumber,
        email: body.email,
        password: body.password
    };

    if (isValidUserData(user)) {
        try {
            const insertUser = await addUser(user);
            if (!insertUser) {
                throw new Error({
                    message: 'DB error!'
                });
            }

            res.status(200).send(insertUser);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        console.log('Test002')
        res.status(400).send({
            message: 'Invalid request!'
        });
    }
});

function isValidUserData(user) {
    return !validator.isEmpty(user.firstName) &&
        !validator.isEmpty(user.lastName) &&
        validator.isMobilePhone(user.mobileNumber) && 
        validator.isEmail(user.email) &&
        validator.isStrongPassword(user.password);
}

module.exports = router;