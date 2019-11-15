const express = require('express');
const router = express.Router();


//controllers for each set of us cases
const ctrlAgents = require('../controllers/agents');
const ctrlLists = require('../controllers/lists');
//const ctrlUser = require('../controllers/users');
//const ctrlSubs = require('../controllers/subs');

// agent routes
router
    .route('/resetall')
    .get(ctrlAgents.resetAll);
router
    .route('/agentsearch')
    .get(ctrlAgents.agentSearch)
router
    .route('/saveagentsearch')
    .get(ctrlAgents.saveAgentSearchResults)
router
    .route('/listsearch')
    .get(ctrlLists.agentListSearch)
router
    .route('/listDelete')
    .get(ctrlLists.agentListDelete)

module.exports = router;