//comment
const reader = require('../controllers/readFile');
const parser = require('../controllers/parseFile');
const buildDb = require('../models/createAgentsDb');
const db = require('../models/db');
const fs = require('fs')

// default user details for initial set up
const defaultUser = {
    name: 'Philip A. Suggars',
    userName: 'felipeazucares',
    pieces: ['Zig-Zag Boy and the Miracle Club']
}

const index = (req, res) => {
    reader.getFileAsync('./app_server/models/Agents_2018.txt').then(dataOutput => {
        console.log('Got data. Serving page');
        // dataOutput = JSON.stringify(dataOutput.split('\t\r\n'));
        dataOutput = dataOutput.split('\t\r\n');
        //console.log(JSON.stringify(dataOutput));
        parsedData = parser.parseFile(dataOutput);
        console.log('Building database');
        try {
            buildDb.connectDB('mongodb://localhost/agents');
            try {
                buildDb.reCreateDb(parsedData);
                console.log('db created with one agent');
                try {
                    buildDb.reCreateDefaultUser(defaultUser);
                    console.log('default user created');
                    res.render('index', { title: 'Agents', agentData: parsedData });
                } catch (err) {
                    console.error(`Error occured in main.js writing default user data to db. Error:${err}`);
                }
            } catch (err) {
                console.error(`Error occured in main.js writing agent data to db. Error:${err}`);
            }
        } catch (err) {
            console.error(`Error connecting to DB in main.js. Error:${err}`);
        }
    }).catch(err => {
        console.error(err);
    });

};

module.exports = {
    index
}

