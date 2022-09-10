const connect = require('./connect');

async function addMenu(menu) {
    console.log('addMenu function call');
    return new Promise(async (resolve, reject) => {
        const { uid, category, item } = menu;

        const sql = `INSERT INTO menu (uid, category, item) VALUES ("${uid}", "${category}", "${item}")`;
        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        
            console.log('Adding menu in DB', menu);
            console.log(result);
            resolve(menu);
        });
    });
}

async function addImage(uid, itemName, image) {
    console.log('addImage function call');
    return new Promise(async (resolve, reject) => {
        const sql = `UPDATE menu SET image=? WHERE uid="${uid}" AND item="${itemName}"`;
        connect.query(sql, image, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        
            console.log('Adding image in menu table for (uid, item): ', uid, itemName);
            console.log(result);
            resolve(result);
        });
    });
}

async function getCategory(uid) {
    console.log('Get Categories by user id');
    return new Promise((resolve, reject) => {
        const sql = `SELECT category from menu WHERE uid="${uid}"`;
        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            if (result.length === 0) {
                reject({ message: 'No category avaialble for user!' })
            }

            console.log(result);
            resolve(result);
        });
    });
}

async function getItemsByCategory(uid, category) {
    console.log('Get Items by Categories');
    return new Promise((resolve, reject) => {
        const sql = `SELECT item from menu WHERE uid="${uid}" AND category="${category}"`;
        connect.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            if (result.length === 0) {
                reject({ message: 'No item in the category!' })
            }

            console.log(result);
            resolve(result);
        });
    });
}

module.exports = {
    addMenu,
    addImage,
    getCategory,
    getItemsByCategory
};