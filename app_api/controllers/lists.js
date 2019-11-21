/* 
    List managment routines
*/

const mongoose = require('mongoose');
const schemas = require('../models/schemas');
//const dbUtils = require('../models/dbUtilities.js');

function agentListFilter(req, res) {
    console.log('In agentListSearch')
    if (!req.params.filter || !req.params.userID) {
        return res
            .status(400)
            .json({ "message": "Filter and userID parameters are required" })
    } else {
        //find user parent document
        const userModel = mongoose.model('User', schemas.userSchema);
        console.log(req.params.filter)
        userModel.findById(req.params.userID)
            .select('agentList')
            .then((agentList) => {
                console.log(agentList)
                // return agentList.find((listItem) => {
                //     return listItem.listName.find(req.params.filter)
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
    //dbUtils.emptyCollection('List', schemas.agentListSchema)
    dbUtils.deleteMany({ "listName": req.query.name }, 'List', schemas.agentListSchema)
        //dbUtils.deleteMany({ "_id": "5dcf1cc9f36e830ba0cd9ed1" }, 'List', schemas.agentListSchema)
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

module.exports = {
    agentListFilter,
    agentListDelete
    //Todo: agentListAdd
}


