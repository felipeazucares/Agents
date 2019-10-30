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

module.exports = {
    agentsSchema,
}



