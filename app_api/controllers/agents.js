/* 
    Process and loads agent data in mongoDb
*/

const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');
const mongoose = require('mongoose');
const agentsSchema = require('../models/agents');
let newAgentModel = mongoose.model('agent', agentsSchema);

const loadAndProcessData = (req, res) => {
    reader.getFileAsync('./app_api/models/Agents_2018.txt').then(dataOutput => {
        console.log('File loaded.');
        // dataOutput = JSON.stringify(dataOutput.split('\t\r\n'));
        dataOutput = dataOutput.split('\t\r\n');
        //console.log(JSON.stringify(dataOutput));
        parsedData = parser.parseFile(dataOutput);
        try {
            //connectDB('mongodb://localhost/agents');
            try {

                reCreateDb(parsedData[1]);
                //console.log('db created with one agent');
                res
                    .status(200)
                    .json({ "Status": "success" })
            } catch (err) {
                console.error(`Error occured writing agent data to db. Error:${err}`);
                res
                    .status(400)
                    .json({ "Status": "Error occurred writing to agent db" })
            }
        } catch (err) {
            console.error(`Error connecting to DB in main.js. Error:${err}`);
            res
                .status(400)
                .json({ "Status": "Error connecting to DB in main.js" })
        }
    }).catch(err => {
        console.error(err);
    });

};

async function connectDB(connectionString) {
    const mongoose = require('mongoose');
    //const db = mongoose.connection;
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true })
        return mongoose.connection
    } catch (err) {
        console.error(`Error connecting to agents database. Error:${err}`);
        return false
    }

}

async function reCreateDb(parsedData) {


    //const agentsDetailsSchema = fullSchema.agentsSchema;

    try {

        const testOne = {
            name: "testagent",
            details: "details",
            telephone: "01234 1222",
            email: "psuggars@icloud.com",
            address: "124 sdghsgd road",
            membership: "yes",
            additionalInfo: "None",
            authors: "Philip Suggars",
            directors: "bob spock",
            agents: "monkey queem",
            website: "http://www.bigsales.com"
        }
        //console.log(testOne)
        // now we create get the first record from the parsedData and stick it into the model
        //newAgentModel.find().remove;
        const newAgent = new newAgentModel(testOne);
        newAgent.save((err, agent) => {
            if (err) {
                console.log("probs cuz")
            }
            else {
                console.log(`${agent.id} Record added`)
                console.log(agent)
            }

        })

    } catch (err) {
        console.error(`Error writing to database in recCreateDb: Error ${err}`);
    }

};

async function reCreateDefaultUser(defaultUser) {
    const mongoose = require('mongoose');
    const usersSchema = require('./agents');
    try {
        let newUser = mongoose.model('users', usersSchema);
        // now we create get the first record from the parsedData and stick it into the model
        const userDoc = newUser(defaultUser);
        await userDoc.save
    } catch (err) {
        console.error(`Error compiling default user to database in recCreateDb: Error ${err}`);
    }

};

//need some error check and something to flush data into the db I think

module.exports = {
    loadAndProcessData,
    //connectDB,
    reCreateDb,
    reCreateDefaultUser
}


