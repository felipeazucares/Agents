/* 
    List managment routines
*/

//const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const dbUtils = require('../models/dbUtilities.js');

function agentListSearch(req, res) {
    console.log('In agentListSearch')
    dbUtils.queryCollection(req.query.qry, '', 'List', schemas.agentListSchema).then((response) => {
        res
            .status(200)
            .json({
                "Status": "success",
                "response": response
            })
    }).catch((err) => {res
        console.error(err);
        res
            .status(400)
            .json({
                "Status": "Error running query",
                "err": err
            })
    })
}

function agentListDelete(req, res) {
    // delete named user agent list 
    console.log('In agentListDelete')
    dbUtils.deleteOne({name: req.query.name},'List', schemas.agentListSchema).then((response) => {
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
    agentListSearch,
    agentListDelete
}


