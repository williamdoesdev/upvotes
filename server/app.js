const express = require('express');
require('express-async-errors');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');

if(!process.env.JWT_PRIVATE_KEY){
    console.log('JWT private key is not defined...');
    process.exit(1);
};

const app = express();

app.use(helmet());
app.use(cors());

require('./api/startup/routes')(app);
const mongooseConnection = require('./api/startup/db')();

const appPort = process.env.PORT || 3000;
const server = app.listen(appPort, () => {
console.log(`listening on port ${appPort}...`);
});

module.exports = server