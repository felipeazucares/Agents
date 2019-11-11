/* 
    Process and loads agent data in mongoDb
*/

//const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const dbUtils = require('../models/dbUtilities.js');

const defaultUser = {
    firstName: 'Philip',
    lastName: 'Suggars',
    userName: 'felipeazucares',
    password: 'Password1',
    pieces: [{ name: 'Zig-Zag Boy and the Miracle Club' }]
}

function resetDatabase(req, res) {
    console.log("about to readfile.");
    reader.getFileAsync('./app_api/models/Agents_2018.txt').then((dataOutput) => {

        dataOutput = dataOutput.split('\t\r\n');
        parsedData = parser.parseFile(dataOutput);
        //create the agent schema
        console.log("about to create collection");
        reCreateAgentCollection(parsedData).then((response) => {
            console.log("Agent data written to schema.");
            dbUtils.emptyCollection('User', schemas.userSchema).then((response) => {
                console.log("User collection cleared");
                dbUtils.insertRecord(defaultUser, 'User', schemas.userSchema).then((response) => {
                    //console.log(JSON.stringify(response));
                    res
                        .status(200)
                        .json({ "Status": "success" })
                }).catch((err) => {
                    res
                        .status(400)
                        .json({
                            "Status": "Error occured adding default user to mongoDB schema",
                            "err": err
                        })
                })
            })
                .catch((err) => {
                    console.error(`Error occured clearing user collection. Error:${err}`);
                    res
                        .status(400)
                        .json({
                            "Status": "Error occured adding default user to mongoDB schema",
                            "err": err
                        })
                })
        }).catch((err) => {
            res
                .status(400)
                .json({
                    "Status": "Error occured clearing & writing agent data to agents collection in MongoDB.",
                    "error": err
                })
        })
    })
        .catch((err) => {
            res
                .status(400)
                .json({
                    "Status": "Error occured reading the agents text file.",
                    "error": err
                })
        })
}

function reCreateAgentCollection(parsedData) {
    //const agentModel = mongoose.model('Agent', schemas.agentSchema);
    console.log('recreate started')
    return new Promise((resolve, reject) => {
        console.log('Promise called')
        dbUtils.emptyCollection('Agent', schema.agentSchema).then(() => {
            //console.log(response)
            console.log('emptied collection');
            dbUtils.insertMany(parsedData, 'Agent', schema.agentSchema).then((response) => {
                //console.log(JSON.stringify(response));
                console.log('Inserted');
                resolve(response)
            }).catch((err) => {
                console.log('insert failed')
                console.error(err);
                reject(err)
                throw (err)
            })
        }).catch((e) => {
            console.log('Error clearing collection')
            console.error(e);
            if (e === null) {
                e = new error
                e.name = "Unknown error occured.";
                e.type = "unknown";
            }
            reject(e)
        })
    })
}

module.exports = {
    resetDatabase
}


