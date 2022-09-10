const connect = require('./connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function addUser(user) {
    console.log('addUser function call');
    return new Promise(async (resolve, reject) => {
        const { firstName, lastName, mobileNumber, email } = user;
        const password = bcrypt.hashSync(user.password, 8);
        
        const records = await checkIfUserEmailExist(user.email);
        if (records > 0) {
            return reject({
                message: 'User already exists!'
            });
        }

        const sql = `INSERT INTO user (firstName, lastName, mobileNumber, email, password) VALUES ("${firstName}", "${lastName}", "${mobileNumber}", "${email}", "${password}")`;
        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        
            console.log('Adding user in DB', user);
            console.log(result);

            delete user.password;
            resolve(user);
        });
    });
}

function checkIfUserEmailExist(email) {
    console.log('Check if email already exists!');
    return new Promise((resolve, reject) => {
        const sql = `SELECT email from user WHERE email="${email}"`;

        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        
            console.log(result.length, result);
            resolve(result.length);
        });
    });
}

function checkUserCrednetials(user) {
    console.log('Check if user credentiasl are correct!');

    const { email, password } = user;
    return new Promise((resolve, reject) => {
        const sql = `SELECT * from user WHERE email="${email}"`;

        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        
            if (!(result && result.length > 0)) {
                const err = { message: 'User with this email doesn\'t exist!' };
                console.log(err);
                reject(err);
            }

            if (!(bcrypt.compareSync(password, result[0].password))) {
                const err = { message: 'Wrong password!' };
                console.log(err);
                reject(err);
            } 

            console.log(result.length, result);
            const token = getJwtToken(result[0]);
            resolve({ token });            
        });
    });
}

function getJwtToken(user) {
    const payLoad = {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        email: user.email
    }
    return jwt.sign( payLoad, process.env.JWT_SECRET, { expiresIn: 30000 });
}

module.exports = {
    addUser,
    checkUserCrednetials
};