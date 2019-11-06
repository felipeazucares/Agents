/*

    Mongoose database utility functions 

*/

const mongoose = require('mongoose');

function insertMany(dataToInsert, modelName, schema) {
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.insertMany(dataToInsert).then((response) => {
            //console.log(JSON.stringify(response));
            resolve(response)
        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    })
}

function emptyCollection(modelName, schema) {
    console.log('here');
    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.deleteMany({}).then((response) => {
            //console.log(JSON.stringify(response));
            console.log('here');
            resolve(response)
        }).catch((err) => {
            console.log('emptyError');
            console.error(err);
            reject(err)
        })
    })
}

function insertRecord(itemToInsert, modelName, schema) {
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

module.exports = {
    insertMany,
    emptyCollection,
    insertRecord
}