/* 
  Controller for core agent collections functionality
*/

//const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const dbUtils = require('../models/dbUtilities.js');
const users = require('/.users.js');

function resetAll(req, res) {
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
            return dbUtils.insertRecord(users.defaultUser, 'User', schemas.userSchema)
        }).then((response) => {
            return dbUtils.emptyCollection('List', schemas.agentListSchema)
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

/*


    TODO: need to error trap all these 
    TODO: - so check for null paramters & refactor to reduce calls to dbUtils

*/
function agentSearch(req, res) {
    //console.log(req.query.field)
    dbUtils.queryCollection(req.query.qry, 'name', 'Agent', schemas.agentSchema).then((response) => {
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

function agentSearchSaveList(req, res) {
    dbUtils.queryCollection(req.query.qry, 'name', 'Agent', schemas.agentSchema).then((queryData) => {
        //console.log(queryData);
        //write records into the given collection with a new name
        // need to send the collection name - if it exists overwrite
        //cook up an object to write to the list object
        listObject = {
            listName: req.query.name,
            agents: queryData
        }
        //find out who the current user is and post the details against that user
        return dbUtils.insertSubDocumentByID(req.query.userID, 'User', schemas.userSchema, 'agentList', listObject)
    }).then((response) => {
        res
            .status(200)
            .json({
                "Status": "Query saved",
                "response": response
            })
    }).catch((err) => {
        console.error(err);
        res
            .status(400)
            .json({
                "Status": "Error running and saving query",
                "err": err
            })
    })
}
module.exports = {
    resetAll,
    agentSearch,
    agentSearchSaveList
}



