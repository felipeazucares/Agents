/* 
    Process and loads agent data in mongoDb
*/

const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');

const defaultUser = {
    firstName: 'Philip',
    lastName: 'Suggars',
    userName: 'felipeazucares',
    password: 'Password1',
    pieces: [{ name: 'Zig-Zag Boy and the Miracle Club' }]
}

const resetDatabase = (req, res) => {
    reader.getFileAsync('./app_api/models/Agents_2018.txt').then(dataOutput => {
        dataOutput = dataOutput.split('\t\r\n');
        parsedData = parser.parseFile(dataOutput);
        //create the agent schema
        try {
            reCreateAgentCollection(parsedData);
            //create a user 
            reCreateUserCollection(defaultUser);

        } catch (err) {
            console.error(`Error occured writing agent data to mongoDB schema. Error:${err}`);
            res
                .status(400)
                .json({ "Status": "Error occured writing agent data to mongoDB schema" })
        }
        res
            .status(200)
            .json({ "Status": "success" })
    }).catch(err => {
        console.error('error occured reading the agent text file');
        console.error(err);
    });
};

async function reCreateAgentCollection(parsedData) {
    const agentModel = mongoose.model('Agent', schemas.agentSchema);
    try {
        //empty database
        result = await agentModel.deleteMany({})
        // , (err, result) => {
        //     if (err) {
        //         console.error(err)
        //     }
        //     else {
        console.log('Existing Documents removed')
        console.log(result)
        //     }
        // })
    } catch (e) {
        console.error('Error occured deleting agent records');
        console.error(e);
    }
    try {
        //write records to collection
        result = await agentModel.insertMany(parsedData);
        // , function (err, response) {
        //     if (err) {
        //         console.error(err);
        //     }
        //     else {
        //         //console.log(response);
        //     }
        // });
    } catch (e) {
        console.error('Error occured inserting agent records');
        console.error(e);
    }

}

async function reCreateUserCollection(defaultUser) {
    const userModel = mongoose.model('User', schemas.userSchema);
    try {
        //empty database
        result = userModel.deleteMany({});
        // , (err, result) => {
        //     if (err) {
        //         console.error(err)
        //     }
        //     else {
        console.log('Existing Documents removed')
        console.log(result)
        //     }
        // })
    } catch (e) {
        console.error('Error occured deleting user records');
        console.error(err);
    }
    try {
        //write records to collection
        userModel.insertMany(defaultUser, function (err, response) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(response);
            }
        });
    } catch (e) {
        console.error('Error occured inserting default user record');
        console.error(err);
    }
}

//need some error check and something to flush data into the db I think

module.exports = {
    resetDatabase
}


