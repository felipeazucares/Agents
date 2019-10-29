/* 
    Open agentsDB and build agents database from the parsed data file
    Should only be run when we need to create the database or update it.
    */

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
    const mongoose = require('mongoose');
    const agentsSchema = require('../models/agents');
    try {
        let newAgent = mongoose.model('agents', agentsSchema);
        // now we create get the first record from the parsedData and stick it into the model
        const agentDoc = newAgent(parsedData[1]);
        await agentDoc.save
    } catch (err) {
        console.error(`Error writing to database in recCreateDb: Error ${err}`);
    }

};

async function reCreateDefaultUser(defaultUser) {
    const mongoose = require('mongoose');
    const usersSchema = require('../models/agents');
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
    connectDB,
    reCreateDb,
    reCreateDefaultUser
}

