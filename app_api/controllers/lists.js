/* 
    List managment routines
*/

const mongoose = require('mongoose');
const schemas = require('../models/schemas');

function agentListFilter(req, res) {
    console.log('In agentListSearch')
    if (!req.params.filter || !req.params.userID) {
        return res
            .status(400)
            .json({ "message": "Filter and userID parameters are required" })
    } else {
        const userModel = mongoose.model('User', schemas.userSchema);
        userModel.findById(req.params.userID)
            .select('agentList')
            .then((parentDoc) => {
                return parentDoc.agentList.filter((listItem) => {
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
}

function agentListDelete(req, res) {
    // delete named user agent list 
    console.log('In agentListDelete')
    if (!req.params.listId || !req.params.userID) {
        return res
            .status(400)
            .json({ "message": "ListId and userID parameters are required" })
    } else {
        const userModel = mongoose.model('User', schemas.userSchema);
        userModel.findById(req.params.userID)
            .select('agentList')
            .then((user) => {
                if (user.agentList && user.agentList.length > 0) {
                    if (user.agentList.id(req.params.listId)) {
                        //console.log(user.agentList._id)
                        const subDoc = user.agentList.id(req.params.listId)
                        console.log(subDoc)
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
}

// todo - adding in an agent will require us to get the _id of the agent and pull their details across from the agent collection


module.exports = {
    agentListFilter,
    agentListDelete
    //Todo: agentListAdd
}


