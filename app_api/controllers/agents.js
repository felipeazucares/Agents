/* 
  Controller for core agent collections functionality
*/

"use strict";

const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const users = require('./users');


// maintenance function to empty out all collections (users/agents etc) and rebuild them from scratch
// todo: split out the database reload from the user recreation - might want to run them seperately
function resetAll(req, res) {
    reader.getFileAsync('./app_api/models/Agents_2018.txt')
        .then((dataOutput) => {
            const parsedData = parser.parseFile(dataOutput.split('\t\r\n'));
            //create the agent schema
            console.log('Recreating collection from file.');
            const agentModel = mongoose.model('Agent', schemas.agentSchema);
            agentModel.deleteMany({}).then((response) => {
                console.log(response);
                return agentModel.insertMany(parsedData)
            }).then(() => {
                const userModel = mongoose.model('User', schemas.userSchema);
                userModel.deleteMany({}).then((response) => {
                    console.log(response);
                    return userModel.insertMany(users.defaultUser)
                }).then((response) => {
                    console.log(JSON.stringify(response));
                    res
                        .status(200)
                        .json({
                            "Status": "success",
                            "response": response
                        })
                }).catch((err) => {
                    console.error(err);
                    res
                        .status(400)
                        .json({
                            "Status": "Error occured resetting the agent and user collections",
                            "err": err
                        })
                })
            }).catch((err) => {
                console.error(err);
                res
                    .status(400)
                    .json({
                        "Status": "Error occured clearing and inserting records into agents collection",
                        "err": err
                    })
            })

        })
}

// query the agents collection with supplied query object - returns array of matching items

function agentSearch(req, res) {
    //console.log(process.env.NODE_ENV.toUpperCase());
    if (process.env.NODE_ENV.toUpperCase() !== 'PRODUCTION') {
        console.log('In agentSearch')
        console.log(req.body.qry);
    }
    if (!req.body.qry) {
        return res
            .status(400)
            .json({ "message": "No query provided" })
    }
    //todo: problem with escaping regex strings in query parameters
    const agentModel = mongoose.model('Agent', schemas.agentSchema);
    agentModel.find(JSON.parse(req.body.qry))
        .select('name')
        .then((response) => {
            console.log('here');
            if (process.env.NODE_ENV.toUpperCase() !== 'PRODUCTION') {
                console.log(response);
            }
            res
                .status(200)
                .json({
                    "Status": "success",
                    "response": response
                })
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

// query the agents collection and store the results as a named list in the user document
function agentSearchSaveList(req, res) {
    if (!req.params.qry || !req.params.name || !req.params.userID) {
        return res
            .status(400)
            .json({ "message": "Name, query and userID are required" })
    }
    const agentModel = mongoose.model('Agent', schemas.agentSchema);
    agentModel.find(JSON.parse(req.params.qry))
        .select('name')
        .then((agentData) => {
            if (agentData && agentData.length > 0) {
                const listObject = {
                    listName: req.params.name,
                    agents: agentData
                }
                const userModel = mongoose.model('User', schemas.userSchema);
                userModel.findById(req.params.userID)
                    .select('agentList')
                    .then((parentDoc) => {
                        if (!parentDoc) {
                            console.error('Unable to find user');
                            return res
                                .status(400)
                                .json({ "message": `Unable to find user:${req.params.userID}` })
                        }
                        parentDoc.agentList.push(listObject)
                        parentDoc.save()
                            .then((err, response) => {
                                if (err) {
                                    return res
                                        .status(400)
                                        .json(err)
                                }
                                else {
                                    res
                                        .status(200)
                                        .json({
                                            "Status": "success",
                                            "response": response
                                        })
                                }
                            })
                    }).catch((err) => {
                        // Error occured finding user provided
                        console.error("Error finding user");
                        console.error(err);
                        res
                            .status(400)
                            .json(err)
                    })
            }
            else {
                res
                    .status(200)
                    .json({
                        "Status": "No records returned",
                        "response": agentData
                    })
            }
        }
        ).catch((err) => {
            console.error("Error running query")
            console.error(err);
            res
                .status(400)
                .json({
                    "Status": "Error running query",
                    "err": err
                })
        })
}


module.exports = {
    resetAll,
    agentSearch,
    agentSearchSaveList
}



