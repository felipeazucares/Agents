/* 
  Controller for core agent collections functionality
*/

"use strict";

const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const dbUtils = require('../models/dbUtilities.js');
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

/*


    TODO: need to error trap all these 
    TODO: - so check for null paramters & refactor to reduce calls to dbUtils

*/

function agentSearch(req, res) {
    if (!req.params.qry) {
        return res
            .status(400)
            .json({ "message": "No query provided" })
    }
    else {
        const agentModel = mongoose.model('Agent', schemas.agentSchema);
        agentModel.find(req.query.qry)
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
    if (!req.params.qry || !req.params.name || !req.params.userID) {
        return res
            .status(400)
            .json({ "message": "Name, query and userID are required" })
    }
    else {
        const agentModel = mongoose.model('Agent', schemas.agentSchema);
        const filterExpr = _createFilter(req.params.qry)
        console.log(filterExpr);
        agentModel.find({})
            .select('name')
            .then((agentData) => {
                console.log(agentData);
                const listObject = {
                    listName: req.query.name,
                    agents: queryData
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
                            parentDoc[agentList].push(listObject)
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
                        if (err) {
                            console.error("Error finding user");
                            return res
                                .status(400)
                                .json(err)
                        }
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

function _createFilter(clauses) {
    console.log('_createfilter');
    const filterArray = [];
    clauses.map((clause) => {
        let queryExpressions = clause.split('~')
        filterArray.push({ [queryExpressions[0]]: { [queryExpressions[1]]: queryExpressions[2] } })
    })

    return filterArray
}
module.exports = {
    resetAll,
    agentSearch,
    agentSearchSaveList
}



