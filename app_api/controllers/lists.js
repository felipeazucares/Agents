/* 
    List managment routines
*/


"use strict";

const mongoose = require('mongoose');
const schemas = require('../models/schemas');

// filter specified users lists using string provided
function agentListFilter(req, res) {
    console.log('In agentListSearch')
    if (!req.params.filter || !req.params.userId) {
        return res
            .status(400)
            .json({ "message": "Filter and userId parameters are required" })
    }
    const userModel = mongoose.model('User', schemas.userSchema);
    userModel.findById(req.params.userId)
        .select('agentList')
        .then((parentDoc) => {
            if (!parentDoc) {
                console.error(err);
                return res
                    .status(400)
                    .json({ "message": "Unable to find user" })
            }
            return parentDoc.agentList.filter((listItem) => {
                // todo: replace this with an includes so broader matching possibilites?
                return listItem.listName == req.params.filter
            })
        })
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
                .json(err)
        })

}

// delete specified user list
function agentListDelete(req, res) {
    console.log('In agentListDelete')
    if (!req.params.listId || !req.params.userId) {
        return res
            .status(400)
            .json({ "message": "ListId and userId parameters are required" })
    } else {
        const userModel = mongoose.model('User', schemas.userSchema);
        userModel.findById(req.params.userId)
            .select('agentList')
            .then((user) => {
                if (user.agentList && user.agentList.length > 0) {
                    if (user.agentList.id(req.params.listId)) {
                        user.agentList.id(req.params.listId).remove();
                        return user.save()
                            .then((err, response) => {
                                if (err) {
                                    console.error("Error saving user document")
                                    console.error(err)
                                    return res
                                        .status(400)
                                        .json(err)
                                }
                                else {
                                    return res
                                        .status(200)
                                        .json({
                                            "status": "Success",
                                            "response": response
                                        })
                                }
                            });
                    } else {
                        return res
                            .status(400)
                            .json({ "message": "Unable to find list id" })
                    }
                }
                else {
                    return res
                        .status(400)
                        .json({ "message": "Unable to find agentList" })
                }
            }).catch((err) => {
                console.error(err);
                res
                    .status(400)
                    .json(err)
            })
    }
}

// Add specified agent to specified user list
function agentListAddItem(req, res) {
    const userModel = mongoose.model('User', schemas.userSchema);
    const agentModel = mongoose.model('Agent', schemas.agentSchema);

    if (!req.params.listId || !req.params.userId || !req.params.agentId) {
        return res
            .status(400)
            .json({ "message": "ListId and userId and agentId parameters are required" })
    }
    // first get the user required
    userModel.findById(req.params.userId)
        .select('agentList')
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ "message": "Unable to find user" })
            }
            return agentModel.findById(req.params.agentId)
                .select('name')
                .then((agentData) => {
                    if (!agentData || agentData.length == 0) {
                        return res
                            .status(400)
                            .json({ "message": "Unable to find agent data to insert" })
                    }
                    // add retrieved agent data to list
                    if (!user.agentList.id(req.params.listId)) {
                        return res
                            .status(400)
                            .json({ "message": "Unable to find user's agentlist to insert into" })
                    }
                    user.agentList.id(req.params.listId).agents.push(agentData)
                    return user.save()
                        .then((err, response) => {
                            if (err) {
                                console.error("Error saving user document")
                                console.error(err)
                                return res
                                    .status(400)
                                    .json(err)
                            }
                            else {
                                return res
                                    .status(200)
                                    .json({
                                        "status": "Success",
                                        "response": response
                                    })
                            }
                        })
                })
                .catch((err) => {
                    console.error('Error fetching agent data')
                    res
                        .status(400)
                        .json({
                            "Status": "Error fetching agent data",
                            "err": err
                        })
                })
        })
        .catch((err) => {
            console.error('Error adding agent to list for user')
            res
                .status(400)
                .json({
                    "Status": "Error adding agent to list for user",
                    "err": err
                })
        })
}

// Remove specified item from specified user list
function agentListDeleteItem(req, res) {
    const userModel = mongoose.model('User', schemas.userSchema);

    if (!req.params.listId || !req.params.userId || !req.params.agentId) {
        return res
            .status(400)
            .json({ "message": "ListId and userId and agentId parameters are required" })
    }
    // first get the user required
    userModel.findById(req.params.userId)
        .select('agentList')
        .then((user) => {
            console.log('user');
            console.log(user)
            if (!user) {
                return res
                    .status(400)
                    .json({ "message": "Unable to find user" })
            }
            // add retrieved agent data to list
            if (!user.agentList.id(req.params.listId)) {
                return res
                    .status(400)
                    .json({ "message": "Unable to find user's agentlist from which to delete item" })
            }
            user.agentList.id(req.params.listId).agents.id(req.params.agentId).remove()
            return user.save()
                .then((err, response) => {
                    if (err) {
                        console.error("Error saving user document")
                        console.error(err)
                        return res
                            .status(400)
                            .json(err)
                    }
                    else {
                        return res
                            .status(200)
                            .json({
                                "status": "Success",
                                "response": response
                            })
                    }
                })
        })
        .catch((err) => {
            console.error('Error deleting agent data from user list')
            res
                .status(400)
                .json({
                    "Status": "Error deleting agent data from user list",
                    "err": err
                })
        })

}

module.exports = {
    agentListFilter,
    agentListDelete,
    agentListAddItem,
    agentListDeleteItem
}


