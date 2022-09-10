const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express');
const app = express();

require('./database/connect');
const auth = require('./middelware/auth');
const signup = require('./routes/user/signup');
const login = require('./routes/user/login');
const addMenu = require('./routes/menu/addMenu');
const uploadImage = require('./routes/menu/uploadImage');
const getCategory = require('./routes/menu/getCategory');
const getItemsByCategory = require('./routes/menu/getItemsByCategory');
const migrate = require('./cron/migrateDB');

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.urlencoded());
app.use(express.json());

// api list
app.use('/api/user/signup', signup);
app.use('/api/user/login', login);
app.use('/api/menu/addmenu', auth, addMenu);
app.use('/api/menu/uploadimage', auth, uploadImage);
app.use('/api/menu/getcategory', auth, getCategory);
app.use('/api/menu/getitemsbycategory', auth, getItemsByCategory);

// Cron to migrate mysql to mongo, executes every 10 mins
setInterval(() => { migrate(); }, 600000);

// creating server on PORT
app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});