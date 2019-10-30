/*

    Define base agents schema

*/
const mongoose = require('mongoose');
const agentsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    membership: {
        type: String,
        required: false
    },
    additionalInfo: {
        type: String,
        required: false
    },
    authors: {
        type: String,
        required: false
    },
    directors: {
        type: String,
        required: false
    },
    agents: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
});

/* 

    sub-document schemas for tracking users and subs 

*/
const agentListSchema = new mongoose.Schema({
    listName: {
        type: String,
        required: true
    },
    pieces: {
        type: [String],
        required: false
    }
});

/* 
    should probably redefine some of these as type date 
*/
const submissionsSchema = new mongoose.Schema({
    dateSubbed: {
        type: String,
        required: true
    },
    dateQueried: {
        type: String,
        requried: false
    },
    dateManuscriptRequested: {
        type: String,
        requried: false
    },
    dateRejected: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        requried: false
    }
});

const piecesListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    submissions: {
        type: [submissionsSchema],
        required: false
    }
});


const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    agentList: {
        type: [agentListSchema],
        required: false
    },
    pieces: {
        type: [piecesListSchema],
        requried: false
    }
});

module.exports = {
    agentsSchema,
    agentListSchema,
    submissionsSchema,
    piecesListSchema,
    usersSchema
}

