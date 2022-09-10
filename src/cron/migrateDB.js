// migrate mysql data to mongodb
const { MongoClient } = require('mongodb');

const connectMysql = require('./../database/connect');

async function migrate() {
    console.log('***********************')
    console.log('Data migration started!');
    console.log('***********************')

    try {
        const getUserData = await getDataFromUserTable();
        console.log(getUserData);
        const getMenuData = await getDataFromMenuTable();
        console.log(getMenuData);

        migrateToMongo(getUserData, getMenuData);

        console.log('***********************')
        console.log('Data migration finished!');
        console.log('***********************')
    } catch (err) {
        console.log(err);
    }
}

function getDataFromUserTable() {
    console.log('getDataFromUserTable');
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from user";
        connectMysql.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            resolve(result);
        });
    });
}

function getDataFromMenuTable() {
    console.log('getDataFromMenuTable');
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from menu";
        connectMysql.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            
            resolve(result);
        });
    });
}

async function migrateToMongo (userData, menuData) {
    const url = "mongodb://127.0.0.1:27017/astics";
    const client = new MongoClient(url);

    try {
        await client.connect();
        
        const db = client.db('astics');
        
        const userCollection = db.collection('user');
        const menuCollection = db.collection('menu');
        
        await userCollection.deleteMany({});
        await menuCollection.deleteMany({});

        await userCollection.insertMany(userData);
        await menuCollection.insertMany(menuData);
    } catch (err) {
        if (err) {
            console.log('Inside catch block: ', err);
        }
    } finally {
        client.close();
    }
}

module.exports = migrate;