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
    console.log(queryString);

    //query markup: | = 'OR' § = 'AND'
    //query structure: Field Operator Value
    //Operator can be any mongoose query operator as we pass it straight into the find clause

    const queryStringClauses = queryString.split(/[|§]/);
    console.log(queryStringClauses);
    const filterObj = {};

    queryStringClauses.map((clause) => {
        let queryExpressions = clause.split('~')
        Object.assign(filterObj,{ [queryExpressions[0]]: { [queryExpressions[1]]: queryExpressions[2] } })
    })

    console.log(filterObj);

    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.find(filterObj).then((response) => {
            resolve(response)
        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    })

}

module.exports = {
    insertMany,
    emptyCollection,
    insertRecord,
    queryCollection
}