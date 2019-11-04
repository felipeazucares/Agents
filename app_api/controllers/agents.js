/* 
    Process and loads agent data in mongoDb
*/

const mongoose = require('mongoose');
const schemas = require('../models/schemas');
const reader = require('./helpers/readFile');
const parser = require('./helpers/parseFile');

const defaultUser = {
    firstName: 'Philip',
    lastName: 'Suggars',
    userName: 'felipeazucares',
    password: 'Password1',
    pieces: [{ name: 'Zig-Zag Boy and the Miracle Club' }]
}

  async function resetDatabase(req, res) {
    reader.getFileAsync('./app_api/models/Agents_2018.txt').then(dataOutput => {
        dataOutput = dataOutput.split('\t\r\n');
        parsedData = parser.parseFile(dataOutput);
        //create the agent schema
        try {
            await reCreateAgentCollection(parsedData);
            try {
                //zap user collection and add default
                  emptyUserCollection();
                try {
                     const result = createUser(defaultUser);
                     console.log(result);
                     if (result!==1){
                         err= result
                        console.error(`Error occured adding default user to mongoDB schema. Error:${err}`);
                        res
                            .status(400)
                            .json({ "Status": "Error occured adding default user to mongoDB schema" })
                     }
                } catch (err) {
                    console.error(`Error occured adding default user to mongoDB schema. Error:${err}`);
                    res
                        .status(400)
                        .json({ "Status": "Error occured adding default user to mongoDB schema" })
                        throw(err)
                }
            } catch (err) {
                console.error(`Error occured emptying user data from mongoDB schema. Error:${err}`);
                res
                    .status(400)
                    .json({ "Status": "Error occured emptying user data from mongoDB schema" })
                    throw(err)
            }
        } catch (err) {
            console.error(`Error occured writing agent data to mongoDB schema. Error:${err}`);
            res
                .status(400)
                .json({ "Status": "Error occured writing agent data to mongoDB schema" })
                throw(err)
        }
        res
            .status(200)
            .json({ "Status": "success" })
    }).catch(err => {
        console.error('error occured reading the agent text file');
        console.error(err);
        throw(err)
    });
};

async function reCreateAgentCollection(parsedData) {
    const agentModel = mongoose.model('Agent', schemas.agentSchema);
    try {
        //empty database
        result = await agentModel.deleteMany({})
        //console.log('Existing Documents removed')
        //console.log(result)

        return result

    } catch (e) {
        console.error('Error occured deleting agent records');
        console.error(e);
    }
    try {
        //write records to collection
        result = await agentModel.insertMany(parsedData);
    } catch (e) {
        console.error('Error occured inserting agent records');
        console.error(e);
    }

}

async function emptyUserCollection() {
    const userModel = mongoose.model('User', schemas.userSchema);
    try {
        //empty database
        result = userModel.deleteMany({});
        console.log('Existing Documents removed')
        console.log(result)
        return result
    } catch (e) {
        console.error('Error occured deleting user records');
        console.error(e);
        throw (e);
    }
}

async function createUser(defaultUser) {
    const userModel = mongoose.model('User', schemas.userSchema);
    try {
        //write records to collection
        userModel.insertMany(defaultUser, function (err, response) {
            if (err) {
                console.error('^^^^^^^^^^^^^^^^^^^^^^^^ERROR^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
                console.error(err);
                return err
                //throw(err)
            }
            else {
                console.log(response);
                return 1
            }
        });
    } catch (e) {
        console.error('Error occured inserting default user record');
        console.error(e);
        throw (e);
    }
}

//need some error check and something to flush data into the db I think

module.exports = {
    resetDatabase
}


