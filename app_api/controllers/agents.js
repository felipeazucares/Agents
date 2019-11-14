/* 
    Clear out agent collection and load parsed records ito database
    Clear out users collectio and Create default user record (me)
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

function reset(req, res) {
    reader.getFileAsync('./app_api/models/Agents_2018.txt')
        .then((dataOutput) => {
            dataOutput = dataOutput.split('\t\r\n');
            parsedData = parser.parseFile(dataOutput);
            //create the agent schema
            console.log('Recreating collection from file.');
            return dbUtils.emptyCollection('Agent', schemas.agentSchema)
        }).then((response) => {
            console.log(response)
            console.log('Agent collection emptied successfully.');
            return dbUtils.insertMany(parsedData, 'Agent', schemas.agentSchema)
        }).then((response) => {
            return dbUtils.emptyCollection('User', schemas.userSchema)
        }).then((response) => {
            console.log(response);
            return dbUtils.insertRecord(defaultUser, 'User', schemas.userSchema)
        }).then((response) => {
            console.log(JSON.stringify(response));
            res
                .status(200)
                .json({ "Status": "success" })
        }).catch((err) => {
            console.error(err);
            res
                .status(400)
                .json({
                    "Status": "Error occured resetting the agent database",
                    "err": err
                })
        })
}
function search(req, res) {
    console.log(req.query.field)
    dbUtils.queryCollection(req.query.qry,'Agent', schemas.agentSchema).then((response) => {
        res
        .status(200)
        .json({ "Status": "success", 
                "response": response})
    }).catch((err) => {
        console.error(err);
        res
            .status(400)
            .json({
                "Status": "Error running query",
                "err": err
            })
    })
}

// function resetDatabase_old(req, res) {
//     console.log("about to readfile.");
//     reader.getFileAsync('./app_api/models/Agents_2018.txt').then((dataOutput) => {
//         //console.log(schemas);
//         dataOutput = dataOutput.split('\t\r\n');
//         parsedData = parser.parseFile(dataOutput);
//         //create the agent schema
//         console.log("about to create collection");
//         reCreateAgentCollection(parsedData).then((response) => {
//             console.log("Agent data written to schema.");
//             dbUtils.emptyCollection('User', schemas.userSchema)
//                 .then((response) => {
//                     console.log("User collection cleared");
//                     dbUtils.insertRecord(defaultUser, 'User', schemas.userSchema)
//                         .then((response) => {
//                             //console.log(JSON.stringify(response));
//                             res
//                                 .status(200)
//                                 .json({ "Status": "success" })
//                         }).catch((err) => {
//                             res
//                                 .status(400)
//                                 .json({
//                                     "Status": "Error occured adding default user to mongoDB schema",
//                                     "err": err
//                                 })
//                         })
//                 })
//                 .catch((err) => {
//                     console.error(`Error occured clearing user collection. Error:${err}`);
//                     res
//                         .status(400)
//                         .json({
//                             "Status": "Error occured adding default user to mongoDB schema",
//                             "err": err
//                         })
//                 })
//         })
//             .catch((err) => {
//                 res
//                     .status(400)
//                     .json({
//                         "Status": "Error occured clearing & writing agent data to agents collection in MongoDB.",
//                         "error": err
//                     })
//             })
//     })
//         .catch((err) => {
//             console.error(err);
//             res
//                 .status(400)
//                 .json({
//                     "Status": "Error occured reading the agents text file.",
//                     "error": err
//                 })
//         })
// }

module.exports = {
    reset,
    search
}


