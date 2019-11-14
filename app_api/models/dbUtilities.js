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

function queryCollection(queryString, searchField, modelName, schema) {
    console.log('in: queryCollection');
    console.log(queryString);
    // query is of the form Field Operator Value

    //first of all split string into clauses

    const queryStringClauses = queryString.split(/[+-]/);
    console.log(queryStringClauses);

    //! doesn't look like its splitting properly on the + and - 
    let filter = {}

    queryStringClauses.map((clause) => {
        let queryExpressions = clause.split('~')
        filter = Object.assign({ [queryExpressions[1]] : { [queryExpressions[2]]: queryExpressions[3] } })
    })

    // let filter = {}
    // filter[queryStringArray[1]] = { [queryStringArray[2]]: queryStringArray[3] };

    //filter = {"details": {}}
    console.log(filter);

    //todo chain other options into the query using + and -? in string expression?

    // where('name').regex(/picard/i).
    // // `age` must be between 29 and 59
    // where('age').gte(29).lte(59);

    //console.log(JSON.stringify(filter));
    //dataModel.find().where(searchField).regex(querystring).where('details').nin.(notstring)

    const dataModel = mongoose.model(modelName, schema);
    return new Promise((resolve, reject) => {
        dataModel.find(filter).then((response) => {
            //console.log(JSON.ssetringify(response));
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