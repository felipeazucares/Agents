/*

    Mongoose database utility functions 
    Library of common mongoose functions for use against all schemas

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

function deleteMany(query, modelName, schema) {
    console.log('in: deleteMany');
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.deleteMany(query).then((response) => {
            //console.log(JSON.stringify(response));
            resolve(response)
        }).catch((err) => {
            console.error(`An error ocurred deleting the records from ${modelName}`);
            reject(err)

        })
    })
}

function deleteOne(query, modelName, schema) {
    console.log('in: deleteOne');
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.deleteOne(query).then((response) => {
            //console.log(JSON.stringify(response));
            resolve(response)
        }).catch((err) => {
            console.error(`An error ocurred deleting the record from ${modelName}`);
            reject(err)

        })
    })
}

function addSubDocumentByID(parentId, parentModelName, parentSchema, subDocumentName, dataToInsert) {
    console.log('in: AddSubDocument');
    const dataModel = mongoose.model(parentModelName, parentSchema);
    return new Promise((resolve, reject) => {
        dataModel.findById(parentId)
            .then((parentDoc) => {
                if (!parentDoc) {
                    console.error('Unable to find user');
                } else {
                    parentDoc[subDocumentName].push(dataToInsert)
                    parentDoc.save((err, response) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(response)
                        }
                    })
                }
            }).catch((err) => {
                console.error(`An error ocurred adding a subdocument to ${parentModelName}`);
                reject(err)
            })
    })
}

function queryCollection(queryString, projection, modelName, schema) {
    console.log('in: queryCollection');
    //query structure: Field Operator Value
    //Operator can be any mongoose query operator as we pass it straight into the find clause
    //todo: initial implementation only provides for logical operators of a single type

    const queryStringClauses = queryString.split('§');
    let filterObj = {};
    let queryObj = {};

    if (parseInt(queryStringClauses[0]) === 1) {
        queryStringClauses.shift();
        filterObj = _createFilter(queryStringClauses);
        queryObj = { $or: filterObj };
        console.log(JSON.stringify(queryObj))
    }
    else {
        queryStringClauses.shift();
        filterObj = _createFilter(queryStringClauses);
        queryObj = { $and: filterObj };
        console.log(JSON.stringify(queryObj))
    }

    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.find(queryObj, projection).then((response) => {
            resolve(response)
        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    })

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
    queryCollection,
    emptyCollection,
    insertMany,
    insertRecord,
    deleteOne,
    deleteMany,
    addSubDocumentByID

}