/* 
    Process and loads agent data in mongoDb
*/

const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const mongoose = require('mongoose');
const schemas = require('../models/schemas');

const defaultUser = {
    firstname: 'Philip',
    lastName: 'Suggars',
    userName: 'felipeazucares',
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
            res
                .status(200)
                .json({ "Status": "success" })

        } catch (err) {
            console.error(`Error occured writing agent data to mongoDB schema. Error:${err}`);
            res
                .status(400)
                .json({ "Status": "Error occured writing agent data to mongoDB schema" })
        }
    }).catch(err => {
        console.error('error occured reading the agent text file');
        console.error(err);
    });

};

function reCreateAgentCollection(parsedData) {
    const agentModel = mongoose.model('Agent', schemas.agentSchema);
    //empty database
    agentModel.deleteMany({}, (err, result) => {
        if (err) {
            console.error(err)
        }
        else {
            console.log('Existing Documents removed')
            console.log(result)
        }
    })
    //write records to collection
    agentModel.insertMany(parsedData, function (err, response) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(response);
        }
    });
}

function reCreateUserCollection(defaultUser) {
    const userModel = mongoose.model('Agent', schemas.userSchema);
    userModel.deleteMany({}, (err, result) => {
        if (err) {
            console.error(err)
        }
        else {
            console.log('Existing Users removed')
            console.log(result)
        }
    })
    //write records to collection
    userModel.create(defaultUser, function (err, response) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(response);
        }
    });
};


//need some error check and something to flush data into the db I think

module.exports = {
    resetDatabase
}


