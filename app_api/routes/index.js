const express = require('express');
const router = express.Router();


//controllers for each set of us cases
const ctrlAgents = require('../controllers/agents');
//const ctrlUser = require('../controllers/users');
//const ctrlSubs = require('../controllers/subs');

//agents
router
    .route('/agents/build')
    .get(ctrlAgents.loadAndProcessData);


module.exports = router;