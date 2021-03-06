/*

    Define base agents schema

*/
const mongoose = require('mongoose');
const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
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
        required: false
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
    }
});


/* 
    lists of agents
*/
const listSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    details: {
        type: String,
        required: false
    }
})

/* 

    sub-document schemas for tracking users and subs 

*/
const agentListSchema = new mongoose.Schema({

    listName: {
        type: String,
        required: true
    },
    agents: {
        type: [listSchema],
        required: true
    }

});



/* 
    should probably redefine some of these as type date 
*/
const submissionSchema = new mongoose.Schema({
    agent: {
        type: agentSchema,
        required: false
    },
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

const pieceListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    submissions: {
        type: [submissionSchema],
        required: false
    }
});


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    agentList: {
        type: [agentListSchema],
        required: true
    },
    pieces: {
        type: [pieceListSchema],
        requried: true
    }
});

module.exports = {
    agentSchema,
    agentListSchema,
    submissionSchema,
    pieceListSchema,
    userSchema
}

