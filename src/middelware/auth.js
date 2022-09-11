const jwt = require('jsonwebtoken');
const connect = require('./../database/connect');

function auth(req, res, next) {
    try {
        // get and verify token
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.uid) {
            return res.status(401).send({ message: 'Invalid token!' });
        }

        // check if user with uid present in db
        // if user doen't exist or fails to varify token, then return error
        const sql = `SELECT uid from user WHERE uid="${decoded.uid}"`;
        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }

            if (!(result && result.length > 0)) {
                const err = { message: 'User doesn\'t exist!' };
                console.log(err);
                return res.status(400).send(err);
            }

            req.uid = result[0].uid;
            req.token = token;
            next();
        });
    } catch (err) {
        res.status(400).send(err);
    }
}

module.exports = auth;