// migrate mysql data to mongodb
const { MongoClient } = require('mongodb');

const connectMysql = require('./../database/connect');

// main function which starts with the migration process
async function migrate() {
    console.log('***********************')
    console.log('Data migration started!');
    console.log('***********************')

    try {
        // fetching user & menu data from mysql and storing it in variables
        const getUserData = await getDataFromUserTable();
        console.log(getUserData);
        const getMenuData = await getDataFromMenuTable();
        console.log(getMenuData);

        // function call to migrate mysql data to mongodb
        migrateToMongo(getUserData, getMenuData);

        console.log('***********************')
        console.log('Data migration finished!');
        console.log('***********************')
    } catch (err) {
        console.log(err);
    }
}

// fetching data of user table from mysql
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

// fetching data of menu table from mysql
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

// migrating data to mongodb
async function migrateToMongo (userData, menuData) {
    // creating connection object for mongo
    const url = "mongodb://127.0.0.1:27017/astics";
    const client = new MongoClient(url);

    try {
        // connecting with mongo server
        await client.connect();
        
        // creating db with name 'astics' in mongodb server
        const db = client.db('astics');
        
        // creating user and menu collection in 'astics' db
        const userCollection = db.collection('user');
        const menuCollection = db.collection('menu');
        
        // clearing old data of user & menu
        await userCollection.deleteMany({});
        await menuCollection.deleteMany({});

        // inserting new data of user menu into collections
        await userCollection.insertMany(userData);
        await menuCollection.insertMany(menuData);
    } catch (err) {
        if (err) {
            console.log('Inside catch block: ', err);
        }
    } finally {
        // closing connection with mongo server
        client.close();
    }
}

module.exports = migrate;