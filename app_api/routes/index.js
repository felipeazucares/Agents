const express = require('express');
const router = express.Router();


//controllers for each set of us cases
const ctrlAgents = require('../controllers/agents');
//const ctrlUser = require('../controllers/users');
//const ctrlSubs = require('../controllers/subs');

//agents
router
    .route('/agents/reset')
    .get(ctrlAgents.resetDatabase);


module.exports = router;