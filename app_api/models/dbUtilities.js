/*

    Mongoose database utility functions 

*/

const mongoose = require('mongoose');

function insertMany(dataToInsert, modelName, schema) {
    console.log('in: insertMany');
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.insertMany(dataToInsert).then((response) => {
            //console.log(JSON.stringify(response));
            //console.log('Records added');
            resolve(response)
        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    })
}

function emptyCollection(modelName, schema) {
    console.log('in: emptyCollection');
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.deleteMany({}).then((response) => {
            //console.log(JSON.stringify(response));
            resolve(response)
        }).catch((err) => {
            console.error('An error ocurred emptying the collection');
            if (err == null || err == undefined) {
                console.log('special');
            }
            reject(err)

        })
    })
}

function insertRecord(itemToInsert, modelName, schema) {
    console.log('in: insertRecord');
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.create(itemToInsert).then((response) => {
            //console.log(JSON.stringify(response));
            resolve(response)
        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    })

}

function queryCollection(queryString, modelName, schema) {
    console.log('in: queryCollection');
    //query markup: | = 'OR' § = 'AND'
    //query structure: Field Operator Value
    //Operator can be any mongoose query operator as we pass it straight into the find clause
    //todo: initial implementation only provides for logical operators of a single type

    const queryStringClauses = queryString.split('§');
    console.log(queryStringClauses);
    let filterObj = {};
    let queryObj = {};

    if (parseInt(queryStringClauses[0]) === 1) {
        queryStringClauses.shift();
        console.log(queryStringClauses);
        filterObj = _createFilter(queryStringClauses);
        //console.log(filterObj);

        queryObj = { $or: [filterObj] };
        // queryObj = {
        //     "$or":
        //         [
        //             {"details": { "$regex": "commercial" }},
        //             { "address": { "$regex": "Road" } }
        //         ]
        // }

    }
    else {
        queryStringClauses.shift();
        console.log(queryStringClauses);
        filterObj = _createFilter(queryStringClauses);
        queryObj = filterObj
    }

    console.log(JSON.stringify(queryObj));
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.find(queryObj).then((response) => {
            resolve(response)
        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    })

}

function _createFilter(clauses) {
    console.log('createfilter');
    console.log(clauses);
    const filter = {};
    clauses.map((clause) => {
        let queryExpressions = clause.split('~')
        newObj = { [queryExpressions[0]]: { [queryExpressions[1]]: queryExpressions[2] } }
        Object.assign(filter, newObj)
    })
    //console.log('here');
    console.log(filter);
    return filter
}

module.exports = {
    insertMany,
    emptyCollection,
    insertRecord,
    queryCollection
}