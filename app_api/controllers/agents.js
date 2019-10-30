/* 
    Process and loads agent data in mongoDb
*/

const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const mongoose = require('mongoose');
const allSchemas = require('../models/agents');
//console.log(allSchemas.agentsSchemaFields)

const loadAndProcessData = (req, res) => {
    reader.getFileAsync('./app_api/models/Agents_2018.txt').then(dataOutput => {
        console.log('File loaded.');
        dataOutput = dataOutput.split('\t\r\n');
        parsedData = parser.parseFile(dataOutput);
        try {
            reCreateDb(parsedData);
            res
                .status(200)
                .json({ "Status": "success" })
        } catch (err) {
            console.error(`Error occured writing agent data to db. Error:${err}`);
            res
                .status(400)
                .json({ "Status": "Error occurred writing to agent db" })
        }

    }).catch(err => {
        console.error(err);
    });

};


function reCreateDb(parsedData) {

    //const agentsSchema = new mongoose.Schema(allSchemas.agentsSchema);
    // compile it 

    const agentsModel = mongoose.model('Agent', allSchemas.agentsSchema);
    //empty database
    agentsModel.deleteMany({}, (err, result) => {
        if (err) {
            console.error(err)
        }
        else {
            console.log('Existing Documents removed')
            console.log(result)
        }
    })
    //write records to collection
    agentsModel.insertMany(parsedData, function (err, response) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(response);
        }
    });

}

function reCreateDefaultUser(defaultUser) {
    const mongoose = require('mongoose');
    const usersSchema = require('./agents');
    try {
        let newUser = mongoose.model('users', usersSchema);
        // now we create get the first record from the parsedData and stick it into the model
        const userDoc = newUser(defaultUser);
        userDoc.save
    } catch (err) {
        console.error(`Error compiling default user to database in recCreateDb: Error ${err}`);
    }

};

//need some error check and something to flush data into the db I think

module.exports = {
    loadAndProcessData,
    reCreateDb,
    reCreateDefaultUser
}


