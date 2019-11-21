/* 
  Controller for core agent collections functionality
*/

"use strict";

const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const users = require('./users');

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

function agentSearch(req, res) {
    if (!req.params.qry) {
        return res
            .status(400)
            .json({ "message": "No query provided" })
    }
    else {
        //todo: problem with escaping regex strings in query parameters
        const agentModel = mongoose.model('Agent', schemas.agentSchema);
        agentModel.find(JSON.parse(req.params.qry))
            .select('name')
            .then((response) => {
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
}

function agentSearchSaveList(req, res) {
    //console.log(req.query.name);
    if (!req.params.qry || !req.params.name || !req.params.userID) {
        return res
            .status(400)
            .json({ "message": "Name, query and userID are required" })
    }
    else {
        const agentModel = mongoose.model('Agent', schemas.agentSchema);
        agentModel.find(JSON.parse(req.params.qry))
            .select('name')
            .then((agentData) => {
                //console.log(agentData.length);
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
                            } else {
                                //console.log(parentDoc);
                                parentDoc.agentList.push(listObject)
                                parentDoc.save((err, response) => {
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
                            }
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
}


module.exports = {
    resetAll,
    agentSearch,
    agentSearchSaveList
}



